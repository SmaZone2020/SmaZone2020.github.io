import { Pagination } from '@heroui/react';
import { getPageRange } from '../lib/pagination';

interface PaginationBarProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function PaginationBar({ currentPage, totalPages, onPageChange }: PaginationBarProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center mt-8 mb-4">
            <Pagination>
                <Pagination.Content>
                    <Pagination.Item>
                        <Pagination.Previous
                            isDisabled={currentPage === 1}
                            onPress={() => onPageChange(currentPage - 1)}
                        >
                            <Pagination.PreviousIcon />
                        </Pagination.Previous>
                    </Pagination.Item>
                    {getPageRange(currentPage, totalPages).map((page, idx) =>
                        page === 'ellipsis' ? (
                            <Pagination.Item key={`ellipsis-${idx}`}>
                                <Pagination.Ellipsis />
                            </Pagination.Item>
                        ) : (
                            <Pagination.Item key={page}>
                                <Pagination.Link
                                    isActive={page === currentPage}
                                    onPress={() => onPageChange(page)}
                                >
                                    {page}
                                </Pagination.Link>
                            </Pagination.Item>
                        )
                    )}
                    <Pagination.Item>
                        <Pagination.Next
                            isDisabled={currentPage === totalPages}
                            onPress={() => onPageChange(currentPage + 1)}
                        >
                            <Pagination.NextIcon />
                        </Pagination.Next>
                    </Pagination.Item>
                </Pagination.Content>
            </Pagination>
        </div>
    );
}

export default PaginationBar;
