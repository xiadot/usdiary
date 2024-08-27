import React, { useEffect, useState } from "react";
import DiaryCard from '../../components/diaryCard';
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/sea'); // Replace with your API endpoint
                const data = response.data;
                setDiaries(data);
                setTotalPages(Math.ceil(data.length / diariesPerPage));
            } catch (error) {
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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
                            date={diary.date}
                            summary={diary.diary_content.substring(0, 20) + ' ...'}
                            imageUrl={diary.post_photo}
                            boardName={diary.board_name}
                            nickname={diary.nickname}
                            diaryId={diary.diary_id}
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
            </div>
        </div>
    );
}

export default Sea;