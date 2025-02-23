import React from "react";

function AIcount(){
    return(
        <div className="flex flex-col card-count space-y-4">
            <div className="flex flex-row justify-between text-color-[var(--main-red)]">
                <h2 className="text-lg font-semibold">Stack Count</h2>
                <p>300/500</p>
            </div>
            <progress className="w-full" value="300" max="500"></progress>
        </div>
    );
}

export default AIcount;