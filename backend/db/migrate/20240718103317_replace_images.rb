class ReplaceImages < ActiveRecord::Migration[7.1]
  def up
    Study.transaction do
      updates = {
        "How many letters can you remember?" => 'Documents-4--Streamline-Bangalore.svg',
        "What are your core personality traits?" => 'Being-At-Peace-02--Streamline-Bangalore.svg',
        "Potential future careers quiz" => 'Customer-Service-Support-Faq--Streamline-Bangalore.svg',
        "Complete your Kinetic Profile" => 'Task-List--Streamline-Bangalore.svg',
        "How much do you remember from science class?" => 'Laboratory--Streamline-Bangalore.svg',
        "Are you an anxious person?" => 'Product-We-Got-A-Problem-01--Streamline-Bangalore.svg',
        "Uncover your achievement & learning goals" => 'Marketing-Marketer-Giving-A-Keynote-01--Streamline-Bangalore.svg',
        "How “in control” do you feel?" => 'Work-Overworked-Employee-01--Streamline-Bangalore.svg',
        "Biology, cells, & highlighting (2 parts)" => 'Biologist-2--Streamline-Bangalore.svg',
        "Can you remember numbers while reading?" => 'Brain-01--Streamline-Bangalore.png',
        "Test your visual skills and finish patterns!" => 'Working-Together--Streamline-Bangalore.svg',
        "Psychology, stress, & highlighting (2 parts)" => 'Therapy-Counseling--Streamline-Bangalore.svg',
        "Do you stick with your goals?" => 'Users-People-Trophy-Awards-01--Streamline-Bangalore.svg',
        "Do you fit in?" => 'Collaboration-2--Streamline-Bangalore.svg',
        "Are you a super reader?" => 'Work-Being-Creative-01--Streamline-Bangalore.svg',
        "Are you science/engineering/math inclined?" => 'Mathematician-2--Streamline-Bangalore.svg',
        "What are your ability beliefs?" => 'Promotion-1--Streamline-Bangalore.svg',
        "How impulsive are you?" => 'Shopping-Payment-With-Card-01--Streamline-Bangalore.svg',
        "Do you survive or thrive?" => 'Bye-2--Streamline-Bangalore.svg',
        "Reflecting on your childhood experiences" => 'Siblings--Streamline-Bangalore.svg',
        "Think you can achieve your learning goals?" => 'Business-Go-To-Market-Strategy-01--Streamline-Bangalore.svg',
        "Biology + Cells Lesson" => 'Dna--Streamline-Bangalore.svg',
        "YOLO: Do you use your time effectively?" => 'Work-Work-From-Home-01--Streamline-Bangalore.svg',
        "US History, Jackson, & highlighting (2 parts)" => 'School-2--Streamline-Bangalore.svg',
        "Are you scared of failing?" => 'Bandaid-On-Heart-4--Streamline-Bangalore.svg',
        "What’s ahead - smooth sailing or stormy seas?" => 'Marketing-A-B-Testing-01--Streamline-Bangalore.svg',
        "What are you feeling? And how often?" => 'Bandaid-On-Heart-01--Streamline-Bangalore.svg',
        "Do you have the persistence you need to learn?" => 'Marketing-Marketing-Target-01--Streamline-Bangalore.svg',
        "Do you procrastinate?" => 'Deadline--Streamline-Bangalore.svg',
        "Can you read quickly AND accurately?" => 'Brain-2--Streamline-Bangalore 1.png',
        "Does creating personal connections help you learn?" => 'Support-2--Streamline-Bangalore.svg',
        "Are you a perfectionist?" => 'Business-Startup-New-Product-Launch-01--Streamline-Bangalore.svg',
        "How much do you know about credit cards?" => 'Credit-Score-2--Streamline-Bangalore.svg',
        "How high is your need for achievement?" => 'Interface-Success-01--Streamline-Bangalore.svg',
        "Are you a curious cat?" => 'Being-At-Peace-01--Streamline-Bangalore-Prod.svg',
        "Are you online ready for studying?" => 'Education-Online-Learning-01--Streamline-Bangalore.svg',
        "So what is financial aid, anyway?" => 'Deposit-4--Streamline-Bangalore.svg',
        "Is math more interesting with cooler examples" => 'New-Discovery--Streamline-Bangalore.svg',
        "What makes OpenStax compelling for you?" => 'Education-Online-Learning-02--Streamline-Bangalore.svg'
      }

      updates.each do |title, image_id|
        study = Study.find_by(title_for_participants: title)
        if study
          study.update(image_id: image_id)
        end
      end
    end
  end
end
