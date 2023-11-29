import { Study } from '@api'
import { React, useEffect, useState } from '@common'
import { useApi } from '@lib'
import { useToggle } from 'rooks';
import { showResearcherNotification } from '@components';
import { Main } from './grid'
import { Button } from '@mantine/core';

export function ApproveStudies() {
    const api = useApi()
    const [studies, setStudies] = useState<Study[]>()

    useEffect(() => {
        api.adminQueryStudies({ status: 'waiting_period' }).then(studies => {
            setStudies(studies.data)
        })
    }, [])

    if (!studies?.length) {
        return <NoStudiesToApprove />
    }

    return (
        <Main className='waiting-studies pt-2 container-lg' gap='large'>
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
        </Main>
    )
}

const NoStudiesToApprove: FC = () => {
    return (
        <Main direction='column' centered>
            <h4>There are currently no studies awaiting approval.</h4>
            <h4>Go relax and enjoy your day!</h4>
        </Main>
    )
}

const StudyRow: FC<{study: Study, setStudies: (studies: Study[] | undefined) => void}> = ({ study, setStudies }) => {
    const [selected, setSelected] = useToggle()
    const api = useApi()

    return (
        <tr className='align-middle'>
            <td scope="row" className='text-center'>
                <input type={'checkbox'} onChange={setSelected} data-testid={`${study.id}-checkbox`} />
            </td>
            <td>
                {study.titleForResearchers}
            </td>
            <td>
                <Button
                    color='blue'
                    disabled={!selected}
                    data-testid={`${study.id}-approve`}
                    onClick={() => {
                        api.adminApproveStudy({ id: study.id }).then(response => {
                            setStudies(response.data)
                            showResearcherNotification(`'${study.titleForResearchers}' was successfully approved!`)
                        })
                    }}
                >
                    Qualtrics Ready
                </Button>
            </td>
        </tr>
    )
}
