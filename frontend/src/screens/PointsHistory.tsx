import React, { useEffect } from "react";
import "./PointsHistory.css";
import dayjs from "dayjs";

import { useParticipantStudies } from "./learner/studies";
import { useEnvironment } from "@lib";
const PointsHistory = ({ activities }: { activities: any[] }) => {
    const data = useParticipantStudies();
    const env = useEnvironment();
    const defaultActivites = [
        ...data.studies.map((study) => ({
            activity: "Points Earned",
            studyName: study.category,
            feedback: "Available",
            date: dayjs(study.completedAt).format("DD/MM/YYYY"),
            balance: study.totalPoints,
        })),
    ];

    console.log("Activites", defaultActivites);

    useEffect(() => {
        if (activities) {
            defaultActivites.push(...activities);
        }
    }, [activities]);
    return (
        <>
            <div className="points-history">
                <h2
                    style={{
                        fontWeight: "bold",
                    }}
                >
                    Points history
                </h2>
                <div className="tableData">
                    <table>
                        <thead>
                            <tr>
                                <th>Activity</th>
                                <th>Study name</th>
                                <th>Feedback</th>
                                <th>Date</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {defaultActivites.map((activity, index) => (
                                <tr
                                    key={index}
                                    className={
                                        activity.activity === "Points Redeemed"
                                            ? "redeemed"
                                            : ""
                                    }
                                >
                                    <td>{activity.activity}</td>
                                    <td>{activity.studyName}</td>

                                    <td
                                        className={
                                            activity.feedback === "Available"
                                                ? "available"
                                                : "na"
                                        }
                                    >
                                        {activity.feedback}
                                    </td>
                                    <td>{activity.date}</td>
                                    <td>{activity.balance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default PointsHistory;
