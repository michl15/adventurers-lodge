import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    RowSelectionState,
    useReactTable,
    Row as TableRow,
} from '@tanstack/react-table';
import { Spell } from '../../constants/types';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Col,
    Container,
    FormCheck,
    FormSelect,
    Row,
} from 'react-bootstrap';
import SpellDetails from '../SpellDetails';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectCharSpell,
    setSelectedSpellsState,
} from '../../redux/SpellsReducer';
import { RootState } from '../../redux';

type SpellTableProps = {
    spellList: Spell[];
};

const StyledRow = styled.tr<{ $even: boolean }>`
    ${(props) => props.$even && 'background-color: oklch(98.4% 0.019 200.873);'}

    &:hover {
        background-color: oklch(95.6% 0.045 203.388);
        color: oklch(48.8% 0.243 264.376);
        cursor: pointer;
    }
`;
const StyledCell = styled.td`
    padding: 10px;
`;

const StyledTableHeader = styled.th`
    padding: 10px;
    font-size: 18px;
`;

const StyledHeader = styled.thead`
    background-color: oklch(62.3% 0.214 259.815);
    color: white;
    border-radius: 10px;
`;

const TableContainer = styled(Container)`
    padding: 10px;
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
`;

const SpellTable = ({ spellList }: SpellTableProps) => {
    const { selectedSpellsState } = useSelector(
        (state: RootState) => state.spells
    );

    const [tableData, setTableData] = useState(spellList);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });
    const [rowSelection, setRowSelection] =
        useState<RowSelectionState>(selectedSpellsState);
    const dispatch = useDispatch();

    const columnHelper = createColumnHelper<Spell>();
    const columns = useMemo(
        () => [
            {
                id: 'select',
                header: '',
                cell: ({ row }: { row: TableRow<Spell> }) => {
                    return (
                        <FormCheck
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => {
                                row.toggleSelected();
                                dispatch(selectCharSpell(row.original));
                            }}
                            checked={row.getIsSelected()}
                        />
                    );
                },
                size: 10,
            },
            columnHelper.accessor('name', {
                cell: (info) => info.getValue(),
                header: 'Spell Name',
                size: 300,
            }),
            columnHelper.accessor('level', {
                cell: (info) =>
                    info.getValue() === 0 ? 'Cantrip' : info.getValue(),
                header: 'Level',
                size: 50,
            }),
            columnHelper.accessor('school.name', {
                cell: (info) => info.getValue(),
                header: 'School',
                size: 200,
            }),
        ],
        [columnHelper, dispatch]
    );

    useEffect(() => {
        // save the selected rows in redux so they remain when modal is reopened
        dispatch(setSelectedSpellsState(rowSelection));
    }, [rowSelection, dispatch]);

    useEffect(() => {
        setTableData(spellList);
    }, [spellList]);

    const table = useReactTable({
        columns,
        data: tableData,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: (row) => true,
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        getRowId: (row) => row.index,
        state: {
            pagination,
            rowSelection,
        },
    });
    return (
        <>
            <TableContainer>
                <StyledTable>
                    <StyledHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <StyledTableHeader key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </StyledTableHeader>
                                ))}
                            </tr>
                        ))}
                    </StyledHeader>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <React.Fragment key={row.id}>
                                <StyledRow
                                    $even={row.index % 2 === 0}
                                    onClick={() => row.toggleExpanded()}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <StyledCell
                                            key={cell.id}
                                            style={{
                                                width: cell.column.getSize(),
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </StyledCell>
                                    ))}
                                </StyledRow>
                                {row.getIsExpanded() && (
                                    <tr>
                                        <td colSpan={row.getAllCells().length}>
                                            <SpellDetails
                                                spellData={row.original}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </StyledTable>
            </TableContainer>
            <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Button
                            onClick={() => {
                                table.toggleAllRowsExpanded(false);
                                setPagination({ ...pagination, pageIndex: 0 });
                            }}
                            disabled={!table.getCanPreviousPage()}
                            size="sm"
                        >
                            {'<< First'}
                        </Button>
                    </Col>
                    <Col md="auto">
                        <Button
                            onClick={() => {
                                table.toggleAllRowsExpanded(false);
                                setPagination({
                                    ...pagination,
                                    pageIndex: pagination.pageIndex - 1,
                                });
                            }}
                            disabled={!table.getCanPreviousPage()}
                            size="sm"
                        >
                            {'< Prev'}
                        </Button>
                    </Col>
                    <Col md="auto">
                        <FormSelect
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => {
                                table.toggleAllRowsExpanded(false);
                                setPagination({
                                    pageIndex: 0,
                                    pageSize: Number(e.target.value),
                                });
                            }}
                            size="sm"
                            style={{ width: 'auto' }}
                        >
                            {[5, 10, 20].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </FormSelect>
                    </Col>
                    <Col md="auto">
                        <Button
                            onClick={() => {
                                table.toggleAllRowsExpanded(false);
                                setPagination({
                                    ...pagination,
                                    pageIndex: pagination.pageIndex + 1,
                                });
                            }}
                            disabled={!table.getCanNextPage()}
                            size="sm"
                        >
                            {'Next >'}
                        </Button>
                    </Col>
                    <Col md="auto">
                        <Button
                            onClick={() => {
                                table.toggleAllRowsExpanded(false);
                                setPagination({
                                    ...pagination,
                                    pageIndex: Math.floor(
                                        spellList.length / pagination.pageSize
                                    ),
                                });
                            }}
                            disabled={!table.getCanNextPage()}
                            size="sm"
                        >
                            {'Last >>'}
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default SpellTable;
