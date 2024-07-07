import React from "react";
import "./PointsHistory.css";

const PointsHistory = ({ activities }: { activities: any[] }) => {
    return (
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
                        {activities.map((activity, index) => (
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
    );
};

export default PointsHistory;
