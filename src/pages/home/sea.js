import React, { useEffect, useState } from "react";
import DiaryCard from '../../components/diaryCard';
import SeaPopup from "../../components/seaPopup";
import '../../assets/css/sea.css'; // Ensure this CSS file is correctly named and located.
import Menu from "../../components/menu";
import axios from "axios";

const Sea = () => {
    const [diaries, setDiaries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageGroup, setPageGroup] = useState(0);
    const diariesPerPage = 12;
    const pagesPerGroup = 5;
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDiaryId, setSelectedDiaryId] = useState(null);

    useEffect(() => {
        let isCancelled = false;
        const fetchData = async () => {
            try {
                setLoading(true);
                const board_id = 3
                const response = await axios.get('/diaries', {
                    params: {
                      page: 1,          // 페이지 번호 (예시)
                      limit: 12,        // 페이지당 항목 수 (예시)
                      board_id: board_id // board_id를 쿼리 파라미터로 전송
                    }
                  });
                  
                console.log(response)
                const  total  = response.data.totalDiaries;
                const diaries= response.data.data.diary;
                console.log(diaries)
                if (!isCancelled) {
                    setDiaries(diaries);
                    setTotalPages(Math.ceil(total / diariesPerPage));
                }
            } catch (error) {
                if (!isCancelled) setError('Failed to load data');
            } finally {
                if (!isCancelled) setLoading(false);
            }
        };
        fetchData();
        return () => {
            isCancelled = true; 
        };
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

    const handleDiaryClick = (diary_id, board_name) => {
        setSelectedDiaryId(diary_id); // 클릭한 다이어리 ID를 설정
    };

    const handleClosePopup = () => {
        setSelectedDiaryId(null); // 팝업 닫기
    };

    return (
        <div className="wrap">
            <Menu />
            <div className="sea-page__container">
                <div className="sea-page__header">
                    <h1 className="sea-page__heading">
                        Today's<br />
                        Sea
                    </h1>
                    <p className="sea-page__description">
                        Explore the beauty and mysteries of the sea through our collection of diaries. Discover experiences, stories, and adventures from the depths of the ocean.
                    </p>
                </div>
                <div className="sea-page__filter-box">
                    <div className="sea-page__filter-option">Latest</div>
                    <div className="sea-page__filter-option">Top Views</div>
                    <div className="sea-page__filter-option">Top Likes</div>
                </div>
                <div className="sea-page__diary-cards">
                    {loading && <p>Loading...</p>}
                    {error && <p>{error}</p>}
                    {!loading && !error && currentDiaries.map((diary) => (
                        <DiaryCard
                            key={diary.diary_id}
                            title={diary.diary_title}
                            date={diary.createdAt}
                            summary={diary.diary_content.substring(0, 20) + ' ...'}
                            imageUrl={diary.post_photo}
                            boardName={diary.Board.board_name}
                            nickname={diary.User.user_nick}
                            diaryId={diary.diary_id}
                            onClick={() => handleDiaryClick(diary.diary_id)}
                        />
                    ))}
                </div>

                <div className="sea-page__pagination">
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

                <div className="sea-page__tree-background"></div>

                {selectedDiaryId && (
                    <SeaPopup diary_id={selectedDiaryId} onClose={handleClosePopup} />
                )}
            </div>
        </div>
    );
}

export default Sea;