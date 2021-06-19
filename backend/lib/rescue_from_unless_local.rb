module RescueFromUnlessLocal

  class << self
    def included(base)
      base.extend ClassMethods
    end
  end

  module ClassMethods
    # Idea here is to do exactly what rescue_from does, but only if the runtime value
    # of consider_all_requests_local is false.  Different values will let us bubble up
    # exceptions (good in development) or rescue exceptions (good in production).  Because
    # the test of the setting is done at the moment the exception is being handled, we
    # can change the value in specs to test both the exception and the rescuing behavior.
    # If send_to_sentry is true and the exception is not already going to be reraised,
    # the exception will be captured off to Sentry.
    def rescue_from_unless_local(*klasses, with: nil, send_to_sentry: false, &block)
      rescue_from(*klasses, with: with) do |exception|
        # This new_block assignment borrowed from pieces of ActiveSupport::Rescuable
        # The Symbol and Proc values of `with` have not been tested :-o
        new_block =
          case with
          when Symbol
            mm = method(with)
            if mm.arity == 0
              -> e { mm.call }
            else
              mm
            end
          when Proc
            with
          else
            if block.present?
              block
            else
              raise ArgumentError, "Need a handler"
            end
          end

        if Rails.application.config.consider_all_requests_local
          raise exception
        elsif send_to_sentry
          Raven.capture_exception(exception)
        end

        instance_exec exception, &new_block
      end
    end
  end

end
