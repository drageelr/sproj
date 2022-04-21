import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TablePagination, Paper, Typography, Box, Toolbar, Button, Divider } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const colorText1 = '#fcfefe';
const colorText2 = '#97989c';
const colorText3 = '#b0b4be';
const colorPrimary = '#00abc6';
const colorSecondary = '#282835';
const colorTertiary = '#1d2027';
const colorQuaternary = '#17c0dc';
const colorQuinary = '#277a8f';
const colorGreen = '#38ab51';
const colorRed = '#ff0000';

const textHeading = {
    // flexGrow: 1,
    fontWeight: 'bold',
    fontSize: 40,
    color: colorQuaternary,
    flex: '1 1 100%'
}

const textLabel = {
    flexGrow: 1,
    fontWeight: 'bold',
    fontSize: 24,
    color: colorPrimary
}

const textLabel2 = {
    flexGrow: 1,
    fontWeight: 'bold',
    fontSize: 16,
    color: colorText1
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);


}

function EnhancedTableHead({order, orderBy, onRequestSort, headCells}) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
  
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                <TableCell
                key={headCell.id}
                align='center'
                sortDirection={orderBy === headCell.id ? order : false}
                >
                    <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                    >
                        <Typography sx={textLabel}>{headCell.label}</Typography>
                        {orderBy === headCell.id ? (
                            <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                        ) : null}
                    </TableSortLabel>
                </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const EnhancedTableToolbar = ({tableName}) => {
    
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            }}
        >
            <Typography
            sx={textHeading}
            id="tableTitle"
            component="div"
            >
            {tableName}
            </Typography>
            <Divider sx={{backgroundColor: colorPrimary}}/>
        </Toolbar>
    );
};

function EnhancedTable({rows, tableName, headCells, keys, link, setId}) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
    const navigate = useNavigate();

    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleOnViewClick = (id) => {
        setId(id);
        navigate(link, { replace: true });
    }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
    return (
        <Paper sx={{ width: '100%', mb: 2, backgroundColor: colorSecondary }}>
            <EnhancedTableToolbar tableName={tableName}/>
            <TableContainer>
                <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size='medium'
                >
                    <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    headCells={headCells}
                    />
                    <TableBody>
                    {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                        rows.slice().sort(getComparator(order, orderBy)) */}
                    {stableSort(rows, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {

                        return (
                            <TableRow
                            hover
                            tabIndex={-1}
                            key={row.id}
                            >
                                {
                                    Object.keys(keys).map((k, i) => (
                                        <TableCell align='center'>
                                            {
                                                keys[k] === 'value' &&
                                                <Typography sx={textLabel2}>{row[k]}</Typography>
                                            }
                                            {
                                                keys[k] === 'boolean' &&
                                                ((row[k] === 1 || row[k] === '1') ? <CheckCircleIcon sx={{color: colorGreen}}/> : <CancelIcon sx={{color: colorRed}}/>)
                                            }
                                            {
                                                keys[k] === 'button' &&
                                                <Button variant='contained' sx={{color: colorText1, backgroundColor: colorQuinary, '&:hover': {backgroundColor: colorPrimary}}} onClick={() => handleOnViewClick(row.id)}>View</Button>
                                            }
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        );
                        })}
                    {emptyRows > 0 && (
                        <TableRow
                        sx={{
                            height: (53) * emptyRows,
                        }}
                        >
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{color: colorText1}}
            />
        </Paper>
    );
}

export default EnhancedTable;