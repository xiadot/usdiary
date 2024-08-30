import React, { useEffect, useState } from "react";
import DiaryCard from '../../components/diaryCard';
import DiaryPopup from "../../components/diaryPopup";
import '../../assets/css/forest.css';
import Menu from "../../components/menu";
import axios from "axios";

const Forest = () => {
    const [diaries, setDiaries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageGroup, setPageGroup] = useState(0);
    const diariesPerPage = 12;
    const pagesPerGroup = 5;
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true); // Add a loading state
    const [error, setError] = useState(null); // Add an error state
    const [selectedDiaryId, setSelectedDiaryId] = useState(null);
    
    useEffect(() => {
        // 하드 코딩된 일기 데이터
        const hardcodedDiaries = [
            {
                diary_id: 1,
                diary_title: "A Walk in the Forest",
                date: "2024-08-28",
                diary_content: "Today, I walked through the forest and saw many beautiful trees and flowers. The air was fresh, and I felt at peace.",
                post_photo: "https://example.com/path-to-image.jpg", // 이미지 URL이 필요하다면 적절한 URL로 교체하세요.
                board_name: "숲",
                nickname: "ForestLover",
            },
            {
                diary_id: 4,
                diary_title: "Evening in the Forest",
                date: "2024-08-28",
                diary_content: "I went back to the forest in the evening, and it was even more serene. The sunset through t",
                post_photo: "https://example.com/path-to-image.jpg", // 이미지 URL이 필요하다면 적절한 URL로 교체하세요.
                board_name: "숲",
                nickname: "ForestLover",
            }
        ];

        // 데이터를 상태에 설정
        setDiaries(hardcodedDiaries);
        setTotalPages(Math.ceil(hardcodedDiaries.length / diariesPerPage));
        setLoading(false);
    }, []);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const indexOfLastDiary = currentPage * diariesPerPage;
    const indexOfFirstDiary = indexOfLastDiary - diariesPerPage;
    const currentDiaries = diaries.slice(indexOfFirstDiary, indexOfLastDiary);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextGroup = () => {
        if (pageGroup * pagesPerGroup + pagesPerGroup < totalPages) {
            setPageGroup(pageGroup + 1);
            setCurrentPage(pageGroup * pagesPerGroup + pagesPerGroup + 1);
        }
    };

    const handlePrevGroup = () => {
        if (pageGroup > 0) {
            setPageGroup(pageGroup - 1);
            setCurrentPage(pageGroup * pagesPerGroup);
        }
    };

    const pageNumbers = Array.from(
        { length: Math.min(pagesPerGroup, totalPages - pageGroup * pagesPerGroup) },
        (_, index) => pageGroup * pagesPerGroup + index + 1
    );

    const handleDiaryClick = (diary_id) => {
        setSelectedDiaryId(diary_id); // 클릭한 다이어리 ID를 설정
    };

    const handleClosePopup = () => {
        setSelectedDiaryId(null); // 팝업 닫기
    };

    return (
        <div className="wrap">
            <Menu />
            <div className="forest-page__container">
                <div className="forest-page__header">
                    <h1 className="forest-page__heading">
                        Today's<br />
                        Forest
                    </h1>
                    <p className="forest-page__description">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ligula sapien, rutrum sed vestibulum eget, rhoncus ac erat. Aliquam erat volutpat. Sed convallis scelerisque enim at fermentum.
                    </p>
                </div>
                <div className="forest-page__filter-box">
                    <div className="forest-page__filter-option">Latest</div>
                    <div className="forest-page__filter-option">Top Views</div>
                    <div className="forest-page__filter-option">Top Likes</div>
                </div>
                <div className="forest-page__diary-cards">
                    {loading && <p>Loading...</p>}
                    {error && <p>{error}</p>}
                    {!loading && !error && currentDiaries.map((diary) => (
                        <DiaryCard
                            key={diary.diary_id}
                            title={diary.diary_title}
                            date={diary.date}
                            summary={diary.diary_content.substring(0, 20) + ' ...'}
                            imageUrl={diary.post_photo}
                            boardName={diary.board_name}
                            nickname={diary.nickname}
                            diaryId={diary.diary_id}
                            onClick={() => handleDiaryClick(diary.diary_id)}
                        />
                    ))}
                </div>

                <div className="forest-page__pagination">
                    <button
                        onClick={handlePrevGroup}
                        disabled={pageGroup === 0}
                        className="pagination-arrow"
                    >
                        &lt;
                    </button>
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => handlePageChange(number)}
                            className={number === currentPage ? 'active' : ''}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        onClick={handleNextGroup}
                        disabled={pageGroup * pagesPerGroup + pagesPerGroup >= totalPages}
                        className="pagination-arrow"
                    >
                        &gt;
                    </button>
                </div>

                <div className="forest-page__tree-background"></div>

                {selectedDiaryId && (
                    <DiaryPopup diary_id={selectedDiaryId} onClose={handleClosePopup} />
                )}
            </div>
        </div>
    );
}

export default Forest;
