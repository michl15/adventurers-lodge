import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    RowSelectionState,
    useReactTable,
    Row as TableRow,
    getFilteredRowModel,
    ColumnFiltersState,
} from '@tanstack/react-table';
import { Class, Spell } from '../../constants/types';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Col,
    Container,
    FormCheck,
    FormSelect,
    Form,
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
import Select from 'react-select';
import { CLASS_LIST, LEVEL_OPTIONS } from '../../constants/constants';

type SpellTableProps = {
    spellList: Spell[];
    charClass?: Class | null;
};

const StyledRow = styled.tr`
    &:hover {
        background-color: oklch(98.4% 0.019 200.873);
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

const SpellTable = ({ spellList, charClass }: SpellTableProps) => {
    const { selectedSpellsState } = useSelector(
        (state: RootState) => state.spells
    );

    const [tableData, setTableData] = useState(spellList);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [rowSelection, setRowSelection] =
        useState<RowSelectionState>(selectedSpellsState);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
        { id: 'classCol', value: charClass?.name || 'All' },
    ]);
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
                size: 200,
                id: 'spellName',
                filterFn: 'includesString',
            }),
            columnHelper.accessor('level', {
                cell: (info) =>
                    info.getValue() === 0 ? 'Cantrip' : info.getValue(),
                header: 'Level',
                id: 'spellLevel',
                filterFn: (row, columnId, filterValue) => {
                    if (filterValue.length > 0) {
                        const val = row.getValue(columnId);
                        return filterValue.includes(val);
                    }
                    return true;
                },
                size: 100,
            }),
            columnHelper.accessor('school.name', {
                cell: (info) => info.getValue(),
                header: 'School',
                id: 'spellSchool',
                size: 100,
            }),
            columnHelper.accessor('classes', {
                cell: (info) => {
                    const classList = info.getValue();
                    const names = classList?.map((charClass) => charClass.name);
                    return names?.join(', ');
                },
                header: 'Classes',
                id: 'classCol',
                size: 300,
                filterFn: (row, columnId, filterValue) => {
                    if (
                        filterValue !== 'All' &&
                        CLASS_LIST.includes(filterValue)
                    ) {
                        const val: Class[] = row.getValue(columnId);
                        return (
                            val.filter((item) => item.name === filterValue)
                                .length > 0
                        );
                    }
                    return true;
                },
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
        getRowCanExpand: (_row) => true,
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        getFilteredRowModel: getFilteredRowModel(),
        getRowId: (row) => row.index,
        state: {
            pagination,
            rowSelection,
            columnFilters,
        },
    });

    const tableFilters = () => {
        return (
            <Container>
                <Row>
                    <Col md={5}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                onChange={(e) => {
                                    setColumnFilters([
                                        ...columnFilters,
                                        {
                                            id: 'spellName',
                                            value: e.target.value,
                                        },
                                    ]);
                                    setPagination({
                                        ...pagination,
                                        pageIndex: 0,
                                    });
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Class</Form.Label>
                            <Form.Select
                                defaultValue={charClass ? charClass.name : ''}
                                onChange={(e) => {
                                    setColumnFilters([
                                        ...columnFilters,
                                        {
                                            id: 'classCol',
                                            value: e.target.value,
                                        },
                                    ]);
                                    setPagination({
                                        ...pagination,
                                        pageIndex: 0,
                                    });
                                }}
                            >
                                <option>All</option>
                                {CLASS_LIST.map((className) => (
                                    <option
                                        key={`class-filter-option-${className}`}
                                    >
                                        {className}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={5}>
                        <Form.Group>
                            <Form.Label>Level</Form.Label>
                            <Select
                                options={LEVEL_OPTIONS}
                                isMulti
                                onChange={(values) => {
                                    setColumnFilters([
                                        ...columnFilters,
                                        {
                                            id: 'spellLevel',
                                            value: values.map(
                                                (val) => val.value
                                            ),
                                        },
                                    ]);
                                    setPagination({
                                        ...pagination,
                                        pageIndex: 0,
                                    });
                                }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
        );
    };
    return (
        <>
            {tableFilters()}
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
                                <StyledRow onClick={() => row.toggleExpanded()}>
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
