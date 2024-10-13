import React, { useEffect, useState } from "react";
import DiaryCard from '../../components/diaryCard';
import ForestPopup from "../../components/forestPopup";
import GuidePopup from '../../components/guide';
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
    const [loading, setLoading] = useState(false); // Add a loading state
    const [error, setError] = useState(null); // Add an error state
    const [selectedDiaryId, setSelectedDiaryId] = useState(null);
    const baseURL = 'http://localhost:3001'
    useEffect(() => {
        let isCancelled = false;
        const fetchData = async () => {
            try {
                setLoading(true);
                const board_id = 1
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
    const currentDiaries = diaries.slice(indexOfFirstDiary, indexOfLastDiary) ;

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
        <div className="page">
            <GuidePopup/>
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
                            diary_title={diary.diary_title}  // title → diary_title
                            createdAt={diary.createdAt}       // date → createdAt
                            diary_content={diary.diary_content.substring(0, 20) + ' ...'}  // summary → diary_content
                            post_photo={`${baseURL}${diary.post_photo}`}    // imageUrl → post_photo
                            board_name={diary.Board.board_name}     // boardName → board_name
                            user_nick={diary.User.user_nick}        // nickname → user_nick
                            diary_id={diary.diary_id}
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
                    <ForestPopup diary_id={selectedDiaryId} onClose={handleClosePopup} />
                )}
            </div>
        </div>
        </div>
    );
}

export default Forest;