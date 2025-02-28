// UserCard.jsx
import React from "react";

const UserCard = ({ user }) => {
    if (!user || !user.personal) return null; // Prevents error by not rendering if user is undefined

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xs border px-4 py-2">
            <div className="flex items-center gap-4">
                <img
                    src={user?.profileImage ||
                        `https://ui-avatars.com/api/?name=${
                            encodeURIComponent(
                                user?.personal?.firstName?.[0] || "",
                            )
                        }`}
                    alt="user"
                    className="w-12 h-12 rounded-full"
                />

                <div>
                    <div className="flex items-center justify-between min-w-[12rem]">
                        <h4 className="font-semibold">
                            {user?.personal?.firstName || "Unknown"}
                        </h4>
                        <span className="text-[10px] text-zinc-600 bg-blue-50 rounded-[3px] px-[2px] border border-indigo-300 ml-2">
                            {user?.academic?.course
                                ? user.academic.course.charAt(0).toUpperCase() +
                                    user.academic.course.slice(1)
                                : "N/A"}
                        </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                        {user?.academic?.collegeName || "No College Info"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
