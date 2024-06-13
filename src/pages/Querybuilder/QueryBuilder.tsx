import "./querybuilder.scss";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Button, Card, CardActions, CardContent, Grid } from "@mui/material";
import React, { useState } from "react";
import LaunchIcon from "@mui/icons-material/Launch";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { postApi } from "../../api/api";
import { IOSSwitch } from "../../components/iosSwitch/IosSwitch";
import { Input } from "../../components/input/Input";
import { separateSQLAndNonSQL } from "../../utils/utils";
import HTMLRenderer from "../../components/htmlRenderer/HtmlRenderer";

function QueryBuilder() {
  const [dbSchema, setDbSchema] = useState(false);
  const [generateSql, setGenerateSql] = useState(true);
  const [explainSql, setExplainSql] = useState(false);
  const [generateQuery, setGenerateQuery] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [statements, setStatements] = useState("");
  const [queryResponse, setQueryResponse] = useState<any>();
  const [query, setQuery] = useState("");
  const [schema, setSchema] = useState("");
  const [queryType, setQueryType] = useState("SQL");

  const [cardPositions, setCardPositions] = useState({
    schemaCard: 1,
    statementCard: 2,
    queryCard: 3,
  });
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
  };

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
  };

  const handleDbSchemaChange = (e: any) => {
    setDbSchema(e.target.checked);
  };

  const handleStatements = (event: any) => {
    setStatements(event.target.value);
  };

  const handleQuery = (event: any) => {
    setQuery(event.target.value);
  };

  async function getQueryData() {
    const response = await postApi(
      { statement: statements, query_type: queryType, schema: schema },
      "generate_query_schema"
    );
    setQueryResponse(separateSQLAndNonSQL(response?.query));
  }

  async function getNaturalData() {
    const response = await postApi(
      { query: query },
      "generate_natural_language"
    );
    console.log(response);
  }


  return (
    <div className="queryBuilderBlock">
      <h1>Generate SQL with AI</h1>
     { !explainSql && <div className="toggleBox">
        <FormControlLabel
          className={`${dbSchema && "active"}`}
          control={
            <IOSSwitch
              sx={{ m: 1 }}
              checked={dbSchema}
              onChange={handleDbSchemaChange}
            />
          }
          label="Add Database Schema"
        />
      </div>}

      <Grid container spacing={4} sx={{ mt: 0 }}>
        {dbSchema && (
          <Grid item xs={12} order={{ md: cardPositions.schemaCard }}>
            <Card className="queryCards">
              <CardContent>
                <h5>Add your database tables here</h5>
                <Input
                  aria-label="Demo input"
                  className="codePreformatBox"
                  multiline
                  placeholder="Type something…"
                />

                {/* <div className="codePreformatBox">
                  <pre>
                    Employee (id, name, department_id); <br />
                    Department (id, name, address);
                    <br />
                    Salary_Payments (id, employee_id, amount: int, date:
                    navchar);
                  </pre>
                </div> */}
              </CardContent>
              <CardActions>
                {generateQuery && (
                  <Button size="small" className="gradientBtn">
                    Generate Query
                  </Button>
                )}
                {!generateQuery && (
                  <Button size="small" className="gradientBtn">
                    Explain Schema
                  </Button>
                )}
              </CardActions>
            </Card>

            <span
              className={`cardSwitchBtn ${
                cardPositions.schemaCard === 3 && "alignTop"
              }`}
              onClick={handleSwitchOne}
            >
              <SwapVertIcon />
            </span>
          </Grid>
        )}

        <Grid item xs={12} order={{ md: cardPositions.statementCard }}>
          <Card className="queryCards">
            <CardContent>
              <h5>Write a statement what you want :</h5>
              <Input
                aria-label="Demo input"
                multiline
                value={statements}
                onChange={handleStatements}
                placeholder="Type something…"
              />
            </CardContent>
            <CardActions>
              {generateSql && (
                <Button size="small" className="iconBtn dropdownBtn">
                  Standard SQL <ArrowDropDownIcon />{" "}
                </Button>
              )}
              {generateSql && (
                <Button
                  size="small"
                  onClick={getQueryData}
                  className="gradientBtn"
                >
                  Generate Query
                </Button>
              )}
              {explainSql && (
                <Button size="small" className="gradientBtn">
                  Copy
                </Button>
              )}

              <Button size="small" className="iconBtn" onClick={handleOpen}>
                <LaunchIcon />
              </Button>
            </CardActions>
          </Card>

          <span
            className={`cardSwitchBtn ${
              cardPositions.statementCard === 3 && "alignTop"
            }`}
            onClick={handleSwitchTwo}
          >
            <SwapVertIcon />
          </span>
        </Grid>

        <Grid item xs={12} order={{ md: cardPositions.queryCard }}>
          <Card className="queryCards">
            <CardContent>
            { !explainSql &&  <h5>Your AI-generated SQL query:</h5> }
              { explainSql && <h5>Write your SQL query here:</h5>}
              { explainSql && <Input
                aria-label="Demo input"
                multiline
                value={query}
                onChange={handleQuery}
                placeholder="Type something…"
              />}

              {!explainSql && (
                <div>
                  <ContentCopyIcon className="copiIconBtn" />
                  <HTMLRenderer htmlContent={queryResponse} />
                </div>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" className="secondaryBtn">
                Copy SQL
              </Button>
              {generateSql && (
                <Button
                  size="small"
                  className="primaryBtn"
                  onClick={handleOpen}
                >
                  Run SQL
                </Button>
              )}
              {explainSql && (
                <Button onClick={getNaturalData} size="small" className="primaryBtn">
                  Explain SQL
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="modalPopup">
            <p>
              The query shows the intraday volatility of AAPL (Apple Inc.) and
              MSFT (Microsoft Corporation) for each week in the year 2023.
            </p>
            <p>The key features of the data are as follows:</p>
            <ul>
              <li>
                The data includes weekly intervals starting from January 2,
                2023, to December 25, 2023.
              </li>
              <li>
                The ticker column represents the stock symbol of the company,
                with 'AAPL' representing Apple Inc. and 'MSFT' representing
                Microsoft Corporation.
              </li>
              <li>
                The intraday_volatility column denotes the measure of volatility
                within a trading day for each stock.
              </li>
            </ul>
            <p>
              <b>Key insights from the data are as follows: </b>
            </p>
            <ul>
              <li>
                AAPL (Apple Inc.) had varying intraday volatility throughout the
                year. The volatility ranged from a low of 3.5700 to a high of
                10.1600.
              </li>
              <li>
                MSFT (Microsoft Corporation) also exhibited fluctuations in
                intraday volatility, with values ranging from a low of 4.3484 to
                a high of 26.4000.
              </li>
              <li>
                Both stocks had their highest intraday volatility in the early
                months of the year, with AAPL reaching its peak in the week
                starting on January 2nd and MSFT reaching its peak in the same
                week.
              </li>
              <li>
                In general, AAPL had lower intraday volatility compared to MSFT
                throughout the year, except in a few instances where AAPL's
                volatility exceeded that of MSFT.
              </li>
            </ul>
            <p>
              Overall, the data provides valuable insights into the intraday
              volatility of AAPL and MSFT for each week in 2023, highlighting
              the fluctuations and patterns in volatility for these two stocks.
            </p>
          </Box>
        </Modal>
      </Grid>
    </div>
  );
}

export default QueryBuilder;
