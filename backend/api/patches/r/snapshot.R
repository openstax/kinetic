#' Take a snapshot of the package library
#'
#' @export
snapshot_for_kinetic_enclave <- function() {
  if (!requireNamespace("renv", quietly = TRUE)) {
    stop("Package 'renv' is not installed. Please install it to use this function.")
  }

  renv::snapshot()
}
