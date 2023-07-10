import { React, useCallback, useEffect, useState } from '@common'
import { Box } from '@components'
import { Studies, Study, StudyAnalysis } from '@api'
import { useApi } from '@lib'
import { useFieldArray } from 'react-hook-form'


export type SelectableStudy = Study & { selected: boolean }

export const SelectedStudies = () => {
    const api = useApi()
    const [studies, setStudies] = useState<Studies>()

    useEffect(() => {
        api.getStudies().then(setStudies)
    }, [])

    const { fields, append, remove } = useFieldArray<{ studies: StudyAnalysis[] }>({ name: 'studies' });

    const onChange=useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        if (ev.target.checked) {
            append({ studyId: Number(ev.target.value) })
        } else if (ev.target.dataset.index != null){
            remove(Number(ev.target.dataset.index))
        }
    }, [append, remove])


    return (
        <Box direction="column" gap>
            {(studies?.data || []).map((study: Study) => {
                const selectedIndex = fields.findIndex(f => f.studyId == study.id)
                return (
                    <Box as="label" gap="small" key={study.id}>
                        <input type="checkbox"
                            checked={selectedIndex !== -1}
                            data-index={selectedIndex}
                            value={study.id}
                            onChange={onChange}
                        />
                        <span>{study.titleForResearchers || study.titleForParticipants}</span>
                    </Box>
                )
            })}
        </Box>
    )
}
