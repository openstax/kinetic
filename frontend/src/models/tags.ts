
export const StudyTypeTags = {
    'type:research': 'Research Study',
    'type:cognitive': 'Cognitive Task',
    'type:assessment': 'Assessment',
    'type:survey': 'Survey',
}

type StudyTypeTagsT = typeof StudyTypeTags


export const StudyTopicTags = {
    'topic:personality': 'Personality',
    'topic:memory': 'Memory',
    'topic:learning': 'Learning',
    'topic:career': 'School & Future Career',
}
type StudyTopicTagsT = typeof StudyTopicTags


export const StudySubjectTags = {
    'subject:biology': 'Biology',
    'subject:business-ethics': 'Business Ethics',
    'subject:chemistry': 'Chemistry',
    'subject:physics': 'Physics',
    'subject:psychology': 'Psychology',
    'subject:sociology': 'Sociology',
    'subject:statistics': 'Statistics',
}
type StudySubjectTagsT = typeof StudySubjectTags

export const ResearchTypeTags = {
    'individual-differences': 'Individual Differences',
    'quasi-experiment': 'Quasi Experiment',
}
type ResearchTypeTagsT = typeof ResearchTypeTags

export const MiscTags = {
    'has-feedback': 'Has feedback',
    'has-incentives': 'Has incentives',
}
type MiscTagsT = typeof MiscTags

type TagLabelT = StudyTypeTagsT & StudySubjectTagsT & StudyTopicTagsT & ResearchTypeTagsT & MiscTagsT

export const TagLabels: TagLabelT = Object.assign({}, StudyTopicTags, StudyTypeTags, StudySubjectTags, ResearchTypeTags, MiscTags)

export type StudySubjectID = keyof typeof StudySubjectTags
