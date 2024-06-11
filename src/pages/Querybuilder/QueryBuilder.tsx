import { styled } from '@mui/material/styles';
import './querybuilder.scss';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Input as BaseInput, InputProps } from '@mui/base/Input';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { Button, Card, CardActions, CardContent, Grid } from '@mui/material';
import React, { useState } from 'react';
import { blue, grey } from '@mui/material/colors';
import LaunchIcon from '@mui/icons-material/Launch';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function QueryBuilder() {
  const [dbSchema, setDbSchema] = useState(false);
  const [generateSql, setGenerateSql] = useState(true);
  const [explainSql, setExplainSql] = useState(false);
  const [generateQuery, setGenerateQuery] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [cardPositions, setCardPositions] = useState({schemaCard: 1, statementCard: 2, queryCard: 3 });
  const toggleState = (stateSetter: any) => stateSetter((prev: any) => !prev);

  const handleSwitchOne = () => {
    
    toggleState(setGenerateQuery);

    setCardPositions((prevPositions) => {
      const { schemaCard } = prevPositions;
      if (schemaCard === 1) {
        return { schemaCard: 2, statementCard: 1, queryCard: 3 };
      } else if (schemaCard === 2) {
        return { schemaCard: 3, statementCard: 1, queryCard: 2 };
      } else {
        return { schemaCard: 2, statementCard: 1, queryCard: 3 };
      }
    });
  }

  const handleSwitchTwo = () => {
    toggleState(setGenerateSql);
    toggleState(setExplainSql);
    setCardPositions((prevPositions) => {
      const { statementCard } = prevPositions;
      if (statementCard === 2) {
        return { schemaCard: 1, statementCard: 3, queryCard: 2 };
      } else {
        return { schemaCard: 1, statementCard: 2, queryCard: 3 };
      }
    });
  }
  
  const handleDbSchemaChange = (e: any) => {
    setDbSchema(e.target.checked);
  }


  const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 40,
    height: 24,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#0C099C',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 20,
      height: 20,
    },
    '& .MuiSwitch-track': {
      borderRadius: 24 / 2,
      backgroundColor: theme.palette.mode === 'light' ? 'rgba(51, 51, 51, 0.49)' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));


  const RootDiv = styled('div')`
  display: flex;
  max-width: 100%;
`;

  const TextareaElement = styled('textarea', {
    shouldForwardProp: (prop) =>
      !['ownerState', 'minRows', 'maxRows'].includes(prop.toString()),
  })(
    ({ theme }) => `
  width: 100%;
  min-height: 90px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5rem;
  padding: 8px 12px;
  border-radius: 16px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
 
      };

  &:hover {
    // border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    // box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
  );

  const Input = React.forwardRef(function CustomInput(
    props: InputProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    return (
      <BaseInput
        slots={{
          root: RootDiv,
          input: 'input',
          textarea: TextareaElement,
        }}
        {...props}
        ref={ref}
      />
    );
  });


  return (
    <div className="queryBuilderBlock">
      <h1>Generate SQL with AI</h1>
      <div className="toggleBox">
        <FormControlLabel
          className={`${dbSchema && 'active'}`}
          control={<IOSSwitch sx={{ m: 1 }} checked={dbSchema} onChange={handleDbSchemaChange} />}
          label="Add Database Schema"
        />
      </div>

      <Grid container spacing={2}>

        {dbSchema &&
          <Grid item xs={12} order={{ md: cardPositions.schemaCard }}>
            <Card className='queryCards'>
              <CardContent>
                <h5>Add your database tables here</h5>
                {/* <Input aria-label="Demo input" className='codePreformatBox' multiline placeholder="Type something…" /> */}

                <div className="codePreformatBox">
                  <pre>
                    Employee (id, name, department_id); <br/>
                    Department (id, name, address);<br/>
                    Salary_Payments (id, employee_id, amount: int, date: navchar);
                  </pre>
                </div>

              </CardContent>
              <CardActions>
                {generateQuery && <Button size="small" className='gradientBtn'>Generate Query</Button>}
                <Button size="small" className='iconBtn dropdownBtn'>Standard SQL <ArrowDropDownIcon /> </Button>
              </CardActions>
            </Card>

            <span className={`cardSwitchBtn ${cardPositions.schemaCard === 3 && 'alignTop'}`} onClick={handleSwitchOne}>
              <SwapVertIcon />
            </span>
          </Grid>
        }

        <Grid item xs={12} order={{ md: cardPositions.statementCard }}>
          <Card className='queryCards'>
            <CardContent>
              <h5>Write a statement what you want :</h5>
              <Input aria-label="Demo input" multiline placeholder="Type something…" />
            </CardContent>
            <CardActions>
              {generateSql && <Button size="small" className='gradientBtn'>Generate SQL</Button>}
              {explainSql && <Button size="small" className='gradientBtn'>Copy</Button>}

              <Button size="small" className='iconBtn' onClick={handleOpen}><LaunchIcon /></Button>
            </CardActions>
          </Card>

          <span className={`cardSwitchBtn ${cardPositions.statementCard === 3 && 'alignTop'}`} onClick={handleSwitchTwo}>
            <SwapVertIcon />
          </span>
        </Grid>

        <Grid item xs={12} order={{ md: cardPositions.queryCard }}>
          <Card className='queryCards'>
            <CardContent>
              <h5>Your AI-generated SQL query:</h5>
              {/* <Input aria-label="Demo input" multiline placeholder="Type something…" /> */}

              <div className="codePreformatBox">
                <ContentCopyIcon className='copiIconBtn' />
                <pre>
                  SELECT * FROM data WHERE find='aapl and msft' AND for each week 2023;
                </pre>
              </div>
            </CardContent>
            <CardActions>
              <Button size="small" className='secondaryBtn'>Copy SQL</Button>
              {generateSql && <Button size="small" className='primaryBtn'>Run SQL</Button>}
              {explainSql && <Button size="small" className='primaryBtn'>Explain SQL</Button>}
            </CardActions>
          </Card>
        </Grid>



        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='modalPopup'>
            <p>The query shows the intraday volatility of AAPL (Apple Inc.) and MSFT (Microsoft Corporation) for each week in the year 2023.</p>
            <p>The key features of the data are as follows:</p>
            <ul>
              <li>The data includes weekly intervals starting from January 2, 2023, to December 25, 2023.</li>
              <li>The ticker column represents the stock symbol of the company, with 'AAPL' representing Apple Inc. and 'MSFT' representing Microsoft Corporation.</li>
              <li>The intraday_volatility column denotes the measure of volatility within a trading day for each stock.</li>
            </ul>
            <p><b>Key insights from the data are as follows:  </b></p>
            <ul>
              <li>AAPL (Apple Inc.) had varying intraday volatility throughout the year. The volatility ranged from a low of 3.5700 to a high of 10.1600.</li>
              <li>MSFT (Microsoft Corporation) also exhibited fluctuations in intraday volatility, with values ranging from a low of 4.3484 to a high of 26.4000.</li>
              <li>Both stocks had their highest intraday volatility in the early months of the year, with AAPL reaching its peak in the week starting on January 2nd and MSFT reaching its peak in the same week.</li>
              <li>In general, AAPL had lower intraday volatility compared to MSFT throughout the year, except in a few instances where AAPL's volatility exceeded that of MSFT.</li>
            </ul>
            <p>Overall, the data provides valuable insights into the intraday volatility of AAPL and MSFT for each week in 2023, highlighting the fluctuations and patterns in volatility for these two stocks.
            </p>

          </Box>
        </Modal>

      </Grid>

    </div>
  )
}

export default QueryBuilder