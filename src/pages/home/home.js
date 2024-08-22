import React from "react";
import Forest from "./forest";
import City from "./city";

const Home = ({ userTendency }) => {
    if (userTendency === '숲') {
        return <Forest />;
    } else if (userTendency === '도시') {
        return <City />;
    } else {
        return (
            <div>
                <h1>알 수 없는 경향성</h1>
                <p>해당 경향성에 맞는 페이지를 찾을 수 없습니다.</p>
            </div>
        );
    }
}

export default Home;