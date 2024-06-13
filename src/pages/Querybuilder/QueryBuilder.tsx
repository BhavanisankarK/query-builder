import "./querybuilder.scss";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  // Select,
} from "@mui/material";
import React, { useState } from "react";
import LaunchIcon from "@mui/icons-material/Launch";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SwapVertIcon from "@mui/icons-material/SwapVert";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { postApi } from "../../api/api";
import { IOSSwitch } from "../../components/iosSwitch/IosSwitch";
import { Input } from "../../components/input/Input";
import { separateSQLAndNonSQL } from "../../utils/utils";
import HTMLRenderer from "../../components/htmlRenderer/HtmlRenderer";
import SelectComponent from "../../components/select/Select";

function QueryBuilder() {
  const [dbSchema, setDbSchema] = useState(false);
  const [generateSql, setGenerateSql] = useState(true);
  const [explainSql, setExplainSql] = useState(false);
  // const [generateQuery, setGenerateQuery] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [statements, setStatements] = useState("");
  const [queryResponse, setQueryResponse] = useState<any>();
  const [query, setQuery] = useState("");
  const [schema, setSchema] = useState("");
  const [queryType, setQueryType] = useState("SQL");
  const [naturalAnswers, setNaturalAnswers] = useState("");
  const [clickExplainSql, setClickExplainSql] = useState(false);

  const [modalText, setModalText] = useState("");

  const [cardPositions, setCardPositions] = useState({
    schemaCard: 1,
    statementCard: 2,
    queryCard: 3,
  });
  const toggleState = (stateSetter: any) => stateSetter((prev: any) => !prev);

  // const handleSwitchOne = () => {
  //   toggleState(setGenerateQuery);

  //   setCardPositions((prevPositions) => {
  //     const { schemaCard } = prevPositions;
  //     if (schemaCard === 1) {
  //       return { schemaCard: 2, statementCard: 1, queryCard: 3 };
  //     } else if (schemaCard === 2) {
  //       return { schemaCard: 3, statementCard: 1, queryCard: 2 };
  //     } else {
  //       return { schemaCard: 2, statementCard: 1, queryCard: 3 };
  //     }
  //   });
  // };

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

  const handleSchema = (event: any) => {
    setSchema(event.target.value);
  };

  async function getQueryData() {
    const response = await postApi(
      { statement: statements, query_type: queryType, schema: schema },
      "generate_query_schema"
    );
    setQueryResponse(separateSQLAndNonSQL(response?.query));
  }

  const types = ["SQL", "MYSQL", "MongoDB", "PostgreSQL"];

  const handleSelectChange = (value: string) => {
    setQueryType(value);
  };
  async function getNaturalData() {
    const response = await postApi(
      { query: query },
      "generate_natural_language"
    );
    setNaturalAnswers(response?.natural_language_statement);
  }

  return (
    <div className="queryBuilderBlock">
      <h1>Generate SQL with AI</h1>
      {!explainSql && (
        <div className="toggleBox">
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
        </div>
      )}

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
                  value={schema}
                  onChange={handleSchema}
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
                <Button
                  disabled={
                    (schema === "" && statements === "") ||
                    schema === "" ||
                    statements === ""
                  }
                  size="small"
                  className="gradientBtn"
                  onClick={getQueryData}
                >
                  Generate Query With Schema
                </Button>
              </CardActions>
            </Card>

            {/* <span
              className={`cardSwitchBtn ${
                cardPositions.schemaCard === 3 && "alignTop"
              }`}
              onClick={handleSwitchOne}
            >
              <SwapVertIcon />
            </span> */}
          </Grid>
        )}

        <Grid item xs={12} order={{ md: cardPositions.statementCard }}>
          <Card className="queryCards">
            <CardContent>
              {!clickExplainSql && <h5>Write a statement what you want :</h5>}
              {clickExplainSql && <h5>Your AI-generated SQL Explanation:</h5>}
              {!clickExplainSql && (
                <Input
                  aria-label="Demo input"
                  multiline
                  value={statements}
                  onChange={handleStatements}
                  placeholder="Type something…"
                />
              )}
              {clickExplainSql && <p>{naturalAnswers}</p>}
            </CardContent>
            <CardActions>
              {generateSql && (
                <SelectComponent
                  options={types}
                  value={queryType}
                  onChange={handleSelectChange}
                />
                // <Button size="small" className="iconBtn dropdownBtn">
                //   Standard SQL <ArrowDropDownIcon />{" "}
                // </Button>
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

              <Button
                size="small"
                className="iconBtn"
                onClick={() => {
                  handleOpen();
                  setModalText(naturalAnswers);
                }}
              >
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
              {!explainSql && <h5>Your AI-generated SQL query:</h5>}
              {explainSql && <h5>Write your SQL query here:</h5>}
              {explainSql && (
                <Input
                  aria-label="Demo input"
                  multiline
                  value={query}
                  onChange={handleQuery}
                  placeholder="Type something…"
                />
              )}
              {!explainSql && (
                <div className="codePreformatBox">
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
                  View Statement
                </Button>
              )}
              {explainSql && (
                <Button
                  onClick={() => {
                    getNaturalData();
                    setClickExplainSql(!clickExplainSql);
                  }}
                  size="small"
                  className="primaryBtn"
                >
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
            <p>{modalText}</p>
          </Box>
        </Modal>
      </Grid>
    </div>
  );
}

export default QueryBuilder;
