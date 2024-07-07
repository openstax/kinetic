import React from "react";
import "./RewardSection.css";

const RewardCard = ({
    icon,
    title,
    points,
    completed,
    date,
    doctor,
}: {
    icon: string;
    title: string;
    points?: number;
    completed?: boolean;
    date?: string;
    doctor: string;
}) => {
    return (
        <div className={`reward-card ${completed ? "completed" : ""}`}>
            <div className="icon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="72"
                    height="72"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0EE094"
                    stroke-width="1"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-target-arrow"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    <path d="M12 7a5 5 0 1 0 5 5" />
                    <path d="M13 3.055a9 9 0 1 0 7.941 7.945" />
                    <path d="M15 6v3h3l3 -3h-3v-3z" />
                    <path d="M15 9l-3 3" />
                </svg>
            </div>
            <div className="content">
                <h3>{title}</h3>
                {points ? (
                    <p className="points">Redeem for {points} points</p>
                ) : (
                    <p className="completed-date">Completed on {date}</p>
                )}
                <p className="doctor">
                    Session with{" "}
                    <span style={{ color: "#255ED3" }}>{doctor}</span>
                </p>
            </div>
            {/* {completed && <div className="check-icon">✓</div>} */}
        </div>
    );
};

const RewardsSection = () => {
    return (
        <div className="rewards-section">
            <h2
                style={{
                    fontWeight: "bold",
                }}
            >
                Rewards
            </h2>
            <div className="rewards-container">
                <RewardCard
                    icon="🎯"
                    title="1:1 career counseling"
                    points={200}
                    doctor="Dr. Debshilla Basu"
                />
                <div className="reward-card-container">
                    <RewardCard
                        icon="🎯"
                        title="Resume review"
                        points={300}
                        doctor="Dr. Debshilla Basu"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-lock top-right-svg"
                    >
                        <circle cx="12" cy="12" r="12" fill="gray" />
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
                        <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                        <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                    </svg>
                </div>

                <RewardCard
                    icon="🎯"
                    title="Essay feedback"
                    completed={true}
                    date="02/08/2024"
                    doctor="Dr. Debshilla Basu"
                />
            </div>
        </div>
    );
};

export default RewardsSection;
