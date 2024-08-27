import React, { useEffect, useState } from "react";
import DiaryCard from '../../components/diaryCard';
import '../../assets/css/city.css';
import Menu from "../../components/menu";
import axios from "axios";

const City = () => {
    const [diaries, setDiaries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageGroup, setPageGroup] = useState(0);
    const diariesPerPage = 12;
    const pagesPerGroup = 5;
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true); // Add a loading state
    const [error, setError] = useState(null); // Add an error state

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/city'); // Replace with your API URL
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
            <div className="city-page__container">
                <div className="city-page__header">
                    <h1 className="city-page__heading">
                        Today's<br />
                        City
                    </h1>
                    <p className="city-page__description">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ligula sapien, rutrum sed vestibulum eget, rhoncus ac erat. Aliquam erat volutpat. Sed convallis scelerisque enim at fermentum.
                    </p>
                </div>
                <div className="city-page__filter-box">
                    <div className="city-page__filter-option">Latest</div>
                    <div className="city-page__filter-option">Top Views</div>
                    <div className="city-page__filter-option">Top Likes</div>
                </div>
                <div className="city-page__diary-cards">
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

                <div className="city-page__pagination">
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

                <div className="city-page__tree-background"></div>
            </div>
        </div>
    );
}

export default City;