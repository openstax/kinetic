import { Study } from '@api'
import { Box, React, useEffect, useState } from '@common'
import { useApi } from '@lib'
import { useToggle } from 'rooks';
import { Button } from '@components';

export function ApproveStudies() {
    const api = useApi()
    const [studies, setStudies] = useState<Study[]>()

    useEffect(() => {
        api.getStudiesAwaitingApproval().then(studies => {
            setStudies(studies.data)
        })
    }, [])

    if (!studies?.length) {
        return (
            <NoStudiesToApprove />
        )
    }

    return (
        <Box className='waiting-studies' direction='column' gap='large'>
            <h3>Studies awaiting approval</h3>

            <table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Internal Study Title</th>
                        <th scope="col">Qualtrics template status (click to confirm it’s ready)</th>
                    </tr>
                </thead>
                <tbody>
                    {studies?.map(study =>
                        <StudyRow study={study} key={study.id} setStudies={setStudies} />
                    )}
                </tbody>
            </table>
        </Box>
    )
}

const NoStudiesToApprove: FC = () => {
    return (
        <Box direction='column' align='center' justify='center'>
            <h4>There are currently no studies awaiting approval.</h4>
            <h4>Go relax and enjoy your day!</h4>
        </Box>
    )
}

const StudyRow: FC<{study: Study, setStudies: (studies: Study[] | undefined) => void}> = ({ study, setStudies }) => {
    const [selected, setSelected] = useToggle()
    const api = useApi()

    return (
        <tr className='align-middle'>
            <td scope="row" className='text-center'>
                <input type={'checkbox'} onChange={setSelected} />
            </td>
            <td>
                {study.titleForResearchers}
            </td>
            <td>
                <Button
                    className='btn-researcher-primary'
                    disabled={!selected}
                    onClick={() => {
                        api.approveStudy({ id: study.id }).then(response => {
                            setStudies(response.data)
                        })
                    }}
                >
                    Qualtrics Ready
                </Button>
            </td>
        </tr>
    )
}
