export type Publication = {
    date: string;
    title: string;
    body: string;
    pdf: string;
    github: string | null;
}

export const publications: Publication[] = [
    {
        date: '2022',
        title: 'Towards Human-like Educational Question Generation with Large Language Models',
        body: 'Wang, Z., Valdez, J., Basu Mallick, D., Baraniuk, R. (2022). Towards Human-like Educational Question Generation with Large Language Models. At the Artificial Intelligence in Education (AIED) conference. Durham, UK.',
        pdf: 'https://dl.acm.org/doi/abs/10.1007/978-3-031-11644-5_13',
        github: null,
    },
    {
        date: '2022',
        title: 'Open-Ended Knowledge Tracing',
        body: 'Liu, N., Wang, Z., Baraniuk, R. G., & Lan, A. (2022). Open-Ended Knowledge Tracing. arXiv preprint arXiv:2203.03716.',
        pdf: 'https://arxiv.org/pdf/2203.03716.pdf',
        github: 'https://github.com/lucy66666/OKT',
    },
    {
        date: '2021',
        title: 'Towards Blooms Taxonomy Classification Without Labels',
        body: 'Wang, Z., Manning, K., Mallick, D. B., & Baraniuk, R. G. (2021, June). Towards Blooms Taxonomy Classification Without Labels. In International Conference on Artificial Intelligence in Education (pp. 433-445). Springer, Cham.',
        pdf: 'https://dl.acm.org/doi/abs/10.1007/978-3-030-78292-4_35',
        github: null,
    },
    {
        date: '2021',
        title: 'Question Mining At Scale: Prediction, Analysis and Personalization',
        body: 'Wang, Z., Tschiatschek, S., Woodhead, S., Hernández-Lobato, J. M., Jones, S. P., Baraniuk, R. G., & Zhang, C. (2021, May). Educational Question Mining At Scale: Prediction, Analysis and Personalization. In Proceedings of the AAAI Conference on Artificial Intelligence (Vol. 35, No. 17, pp. 15669-15677).',
        pdf: 'https://ojs.aaai.org/index.php/AAAI/article/view/17846',
        github: null,
    },
    {
        date: '2021',
        title: 'A Case Study on Bootstrapping Ontology Graphs from Textbooks',
        body: 'Vinay K. Chaudhri, Matthew Boggess, Han Lin Aung, Debshila Basu Mallick, Andrew C Waters, Richard Baraniuk. (2021). A Case Study on Bootstrapping Ontology Graphs from Textbooks. In the Proceedings of the Automated Knowledge Base Construction Conference.',
        pdf: 'https://www.akbc.ws/2021/assets/pdfs/nDe2D8DDXKR.pdf',
        github: 'https://openstax.github.io/research-kg-learning/akbc-2021/',
    },
    {
        date: '2021',
        title: 'Math Word Problem Generation with Mathematical Consistency and Problem Context Constraints',
        body: 'Wang, Z., Lan, A. S., & Baraniuk, R. G. (2021). Math Word Problem Generation with Mathematical Consistency and Problem Context Constraints. arXiv preprint arXiv:2109.04546.',
        pdf: 'https://arxiv.org/pdf/2109.04546.pdf',
        github: null,
    },
    {
        date: '2020',
        title: 'A variational factor analysis framework for efficient bayesian learning analytics',
        body: 'Wang, Z., Gu, Y., Lan, A., & Baraniuk, R. (2020). Varfa: A variational factor analysis framework for efficient bayesian learning analytics. arXiv preprint arXiv:2005.13107. ',
        pdf: 'https://arxiv.org/abs/2005.13107',
        github: null,
    },
    {
        date: '2019',
        title: 'A Meta-Learning Augmented Bidirectional Transformer Model for Automatic Short Answer Grading',
        body: 'Wang, Z., Lan, A. S., Waters, A. E., Grimaldi, P., & Baraniuk, R. G. (2019, July). A Meta-Learning Augmented Bidirectional Transformer Model for Automatic Short Answer Grading. In EDM.',
        pdf: 'https://people.umass.edu/~andrewlan/papers/19edm-bert.pdf',
        github: null,
    },
    {
        date: '2019',
        title: 'Do open educational resources improve student learning? Implications of the access hypothesis',
        body: 'Grimaldi PJ,Basu Mallick D,Waters AE, Baraniuk RG. (2019) Do open educational resources improve student learning? Implications of the access hypothesis. PLoS ONE 14(3): e0212508.',
        pdf: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0212508',
        github: 'https://github.com/openstax/oer-simulation-study',
    },
    {
        date: '2018',
        title: 'QG-net: a data-driven question generation model for educational content',
        body: 'Wang, Z., Lan, A. S., Nie, W., Waters, A. E., Grimaldi, P. J., & Baraniuk, R. G. (2018, June). QG-net: a data-driven question generation model for educational content. In Proceedings of the Fifth Annual ACM Conference on Learning at Scale (pp. 1-10).',
        pdf: 'https://people.umass.edu/~andrewlan/papers/18l@s-qgen.pdf',
        github: 'https://github.com/anonymous10101010101/QG-Net',
    },
    {
        date: '2017',
        title: 'A Latent Factor Model For Instructor Content Preference Analysis',
        body: 'Jack Z. Wang, Andrew S. Lan, Phillip J. Grimaldi, Richard G. Baraniuk. (2017). A Latent Factor Model For Instructor Content Preference Analysis. Proceedings of the 10th International Conference on Educational Data Mining.',
        pdf: 'https://eric.ed.gov/?id=ED596562',
        github: null,
    },
    {
        date: '2017',
        title: 'BLAh: Boolean Logic Analysis for Graded Student Response Data',
        body: 'Andrew S. Lan, Andrew E. Waters, Christoph Studer, Richard G. Baraniuk. (2017). BLAh: Boolean Logic Analysis for Graded Student Response Data. IEEE JOURNAL OF SELECTED TOPICS IN SIGNAL PROCESSING, VOL. 11, NO. 5.',
        pdf: 'https://ieeexplore.ieee.org/document/7967714/',
        github: null,
    },
    {
        date: '2017',
        title: 'Data-Mining Textual Responses to Uncover Misconception Patterns',
        body: 'Joshua J. Michalenko, Andrew S. Lan, Andrew E. Waters, Phillip J. Grimaldi, Richard G. Baraniuk. (2017). Data-Mining Textual Responses to Uncover Misconception Patterns. Proceedings of the 10th International Conference on Educational Data Mining.',
        pdf: 'https://eric.ed.gov/?id=ED596591',
        github: null,
    },
    {
        date: '2017',
        title: 'Short-Answer Responses to STEM Exercises: Measuring Response Validity and Its Impact on Learning',
        body: 'Andrew Waters, Phillip Grimaldi, Andrew Lan, Richard Baraniuk. (2017). Short-Answer Responses to STEM Exercises: Measuring Response Validity and Its Impact on Learning. Proceedings of the 10th International Conference on Educational Data Mining.',
        pdf: 'http://educationaldatamining.org/EDM2017/proc_files/papers/paper_93.pdf',
        github: null,
    },
    {
        date: '2014',
        title: 'Integrating Cognitive Science and Technology Improves Learning in a STEM Classroom',
        body: 'Andrew C. Butler, Elizabeth J. Marsh, J. P. Slavinsky, Richard G. Baraniuk. (2014). Integrating Cognitive Science and Technology Improves Learning in a STEM Classroom. Educ Psychol Rev (2014) 26:331–340.',
        pdf: 'https://www.jstor.org/stable/43549798#metadata_info_tab_contents',
        github: null,
    },
    {
        date: '2014',
        title: 'Sparse Factor Analysis for Learning and Content Analytics',
        body: 'Andrew S. Lan, Andrew E. Waters, Christoph Studer, Richard G. Baraniuk. (2014). Sparse Factor Analysis for Learning and Content Analytics. Journal of Machine Learning Research 15.',
        pdf: 'https://jmlr.org/papers/volume15/lan14a/lan14a.pdf',
        github: null,
    },
    {
        date: '2014',
        title: 'Time-varying Learning and Content Analytics via Sparse Factor Analysis',
        body: 'Andrew S. Lan, Christoph Studer, Richard G. Baraniuk. (2014).Time-varying Learning and Content Analytics via Sparse Factor Analysis. ACM 978-1-4503-2956-9/14/08.',
        pdf: 'http://dx.doi.org/10.1145/2623330.2623631.',
        github: null,
    },
    {
        date: '2013',
        title: 'A Revision Of The Academic Locus Of Control Scale For College Students',
        body: 'Nicholas A. Curtis, Ashton D. Trice. A Revision Of The Academic Locus Of Control Scale For College Students. Perceptual & Motor Skills: Physical Development & Measurement 2013, 116, 3, 817-829.',
        pdf: 'https://journals.sagepub.com/doi/10.2466/08.03.PMS.116.3.817-829',
        github: null,
    },
    {
        date: '2011',
        title: 'Retrieval Practice Produces More Learning than Elaborative Studying with Concept Mapping',
        body: 'Jeffrey D. Karpicke, Janell R. Blunt. (2011).Retrieval Practice Produces More Learning than Elaborative Studying with Concept Mapping. Science 331 (6018), 772-775.',
        pdf: 'https://www.science.org/doi/10.1126/science.1199327',
        github: null,
    },
]

type CTA = {
    text: string;
    url: string;
}

export type ResearchArea = {
    title: string;
    description: string;
    image: string | null;
    cta: CTA | null,
    github: string | null;
    publication: string | null;
}

export type ResearchFocusAreas = {
    [key: string]: ResearchArea[]
}

export const researchFocusAreas: ResearchFocusAreas = {
    kinetic: [
        {
            title: 'Understanding learners',
            description: 'To understand who the learners are, Kinetic is building a library of measures of learner characteristics for vetted researchers to use in their research (e.g., as a focal or control variable). Kinetic’s Library of Learner Characteristics comprises studies that capture socio-demographics, cognitive, motivational, and other psychosocial characteristics of learners who participate in specific Kinetic activities. Moreover, these studies provide personalized feedback to support learners’ academic and career success.',
            image: '',
            cta: {
                text: 'Learn more about Learner Characteristics library on Kinetic',
                url: 'tbd',
            },
            github: null,
            publication: null,
        },
        {
            title: 'Learning Research on Kinetic',
            description: 'On Kinetic, researchers can implement various study designs with single or multiple sessions. For example, researchers are currently exploring the effectiveness of different forms of multimedia lessons on knowledge retention in a randomized, four-condition, between-subjects study. In this and all our research, every condition prioritizes creating a positive learner experience in all aspects of the infrastructure.',
            image: '',
            cta: {
                text: 'Interested in using Kinetic?',
                url: 'https://openstax.org/kinetic/',
            },
            github: null,
            publication: null,
        },
    ],
    ai: [
        {
            title: 'Towards Human-like Educational Question Generation with Large Language Models',
            description: 'In this work, we investigated the impact of various Pretrained Language Model prompting strategies on the quality of generated questions. With empirical evaluation, we identified the prompting strategy that is most likely to lead to high-quality generated questions. We demonstrate the utility of best-strategy generated questions by presenting these together with human-authored questions to a subject matter expert, who could not effectively distinguish between generated and human-authored questions.',
            image: '',
            cta: null,
            github: 'https://github.com/openstax/research-question-generation-gpt3',
            publication: 'https://link.springer.com/chapter/10.1007/978-3-031-11644-5_13',
        },
        {
            title: 'A Case Study in Bootstrapping Ontology Graphs from Textbooks',
            description: 'We aimed to address: to what extent can automated extraction and crowdsourcing techniques be combined to bootstrap the creation of comprehensive and accurate ontology knowledge graphs? By adapting the state-of-the-art language model BERT to the task, and leveraging a novel relationship selection task, we showed that even though it is difficult to achieve a high precision and recall, automated term extraction and crowdsourcing provide a way to bootstrap the ontology graph creation for further refinement and improvement through human effort.',
            image: '',
            cta: null,
            github: 'https://openstax.github.io/research-kg-learning/akbc-2021/',
            publication: 'https://www.akbc.ws/2021/assets/pdfs/nDe2D8DDXKR.pdf',
        },
    ],
    education: [
        {
            title: 'Rice Algebra Initiative for Success and Equity (RAISE)',
            description: 'RAISE uses learning science research to drive efforts to close socioeconomic gaps in education achievement in Algebra 1. Through rapid-cycle research studies, we research and develop math solutions aimed at improving student achievement among underserved students and generating insights and tools for teaching and learning. RAISE is a Research Practice Partnership (RPP), with practicing teachers both informing our objectives and benefiting from our findings.',
            image: '',
            cta: {
                text: 'Learn more about RAISE',
                url: 'https://raise.rice.edu/',
            },
            github: null,
            publication: null,
        },
        {
            title: 'Project Equip',
            description: 'Project Equip was a 3-yr collaboration among Rice’s education research centers (OpenStax, the Houston Education Research Consortium, and the Glasscock School of Continuing Studies) and Houston ISD. The program combined teacher professional development and classroom access to the OpenStax Tutor homework system to reduce inequities in AP course outcomes for underrepresented groups. After the Covid-19 pandemic and the shift to online learning, we pivoted the research to student and teacher support. Despite these challenges, teachers nevertheless significantly impacted how students used and benefited from Tutor.',
            image: '',
            cta: null,
            github: null,
            publication: null,
        },
    ],
}

export type ResearchMember = {
    image: string;
    name: string;
    title: string;
}

export type ResearchMembers = {
    [key: string]: ResearchMember[]
}

export const researchMembers: ResearchMembers = {
    current: [

    ],
    collaborating: [

    ],
    alumni: [

    ],
};
