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
import React, { useEffect, useState } from "react";
import LaunchIcon from "@mui/icons-material/Launch";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SwapVertIcon from "@mui/icons-material/SwapVert";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { postApi } from "../../api/api";
import { IOSSwitch } from "../../components/iosSwitch/IosSwitch";
import { Input } from "../../components/input/Input";
import SelectComponent from "../../components/select/Select";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

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
  const [queryType, setQueryType] = useState("MYSQL");
  const [naturalAnswers, setNaturalAnswers] = useState("");
  const [clickExplainSql, setClickExplainSql] = useState(false);

  const [loading, setLoading] = useState(false);

  const [modalText, setModalText] = useState("");
  const [contentCopied, setContentCopied] = useState("");

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
    toggleState(setClickExplainSql);
    setCardPositions((prevPositions) => {
      const { statementCard } = prevPositions;
      if (statementCard === 2) {
        return { schemaCard: 1, statementCard: 3, queryCard: 2 };
      } else {
        return { schemaCard: 1, statementCard: 2, queryCard: 3 };
      }
    });
    getNaturalData(true);
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
    setLoading(true);
    const response = await postApi(
      { statement: statements, query_type: queryType, schema: schema },
      "generate_query_schema"
    );
    setQueryResponse(response);
    setQuery(response?.query);
    setModalText(response);

    setLoading(false);
  }

  async function getQueryDataForModal() {
    setLoading(true);
    const response = await postApi(
      { statement: statements, query_type: queryType, schema: schema },
      "generate_query_schema"
    );
    setQueryResponse(response);
    setModalText(response);

    setLoading(false);
  }
  const types = [
    "Standard SQL",
    "PostgreSQL",
    "MongoDB",
    "MYSQL",
    "MS SQL",
    "MariaDB",
    "Cypher",
    "Snowflake",
    "BigQuery",
    "SQLite",
    "DB2",
    "Hive",
    "Apache Spark",
    "Redshift",
    "PL/SQL",
    "Clickhouse",
    "Hibernate",
    "Cassandra",
  ];

  const handleSelectChange = (value: string) => {
    setQueryType(value);
  };

  async function getNaturalData(isRequired: boolean) {
    const response = await postApi(
      { query: query },
      "generate_natural_language"
    );
    setNaturalAnswers(response?.natural_language_statement);
    if(isRequired){
      setStatements(response?.natural_language_statement);
    }
    setModalText(response?.natural_language_statement);
  }

  // const copyToClipboard = (e: any, content: any) => {
  //   navigator.clipboard
  //     .writeText(content)
  //     .then(() => {
  //       setContentCopied(e.target.innerText);
  //     })
  //     .catch((err) => {
  //       console.error("Failed to copy!", err);
  //     });
  // };

  const unsecuredCopyToClipboard = (text: any) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand("copy");
    } catch (err) {
        console.error("Unable to copy to clipboard", err);
    }
    document.body.removeChild(textArea);
};

const copyToClipboard = async (e: any, content: any) => {
    if (window.isSecureContext && navigator.clipboard) {
        navigator.clipboard.writeText(content);
    } else {
        unsecuredCopyToClipboard(content);
    }
    setContentCopied(e.target.innerText);
};


  useEffect(() => {
    setTimeout(() => {
      setContentCopied("");
    }, 4000);
  }, [contentCopied]);

  const renderContent = (content: string | Record<string, string>) => {
    if (typeof content === "string") {
      return <p>{content}</p>;
    } else if (typeof content === "object" && content !== null) {
      return (
        // <div className="codePreformatBox">
        //   {Object.entries(content).map(([key, value], index) => (
        //     key === 'query' ?
        //       <pre  key={index}>{value}</pre> :
        //       <p key={index}>{value}</p>
        //   ))}
        // </div>
        <div className="codePreformatBox">
          {Object.entries(content).map(([key, value], index) =>
            key === "query" ? <></> : <p key={index}>{value}</p>
          )}
        </div>
      );
    } else {
      return <p>Invalid content</p>;
    }
  };

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
        {dbSchema && !explainSql && (
          <Grid item xs={12} order={{ md: cardPositions.schemaCard }}>
            <Card className="queryCards">
              <CardContent>
                <h5>Add your database tables here</h5>
                <Input
                  aria-label="Demo input"
                  multiline
                  value={schema}
                  onChange={handleSchema}
                  className="dbSchemaInput"
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
              
                <Input
                  aria-label="Demo input"
                  multiline
                  value={statements}
                  onChange={handleStatements}
                  placeholder="Type something…"
                />
              
              {/* {clickExplainSql && (
                <div className="codePreformatBox">
                  <p>{naturalAnswers}</p>
                </div>
              )} */}
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
                <Button
                  size="small"
                  className="gradientBtn"
                  onClick={(e) => copyToClipboard(e, naturalAnswers)}
                >
                  {contentCopied === "Copy" ? (
                    <>
                      Content Copied <CheckCircleOutlineIcon />
                    </>
                  ) : (
                    "Copy"
                  )}
                </Button>
              )}

              <Button
                size="small"
                className="iconBtn"
                onClick={() => {
                  handleOpen();
                  getQueryDataForModal();
                  //}
                  // } else {
                  //   handleOpen();
                  //   setModalText(naturalAnswers);
                  // }
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
              <div className="sqlQueryInput">
                <Input
                  aria-label="Demo input"
                  multiline
                  value={query}
                  onChange={handleQuery}
                  placeholder="Type something…"
                />
              </div>

              {/* {!explainSql && (
                <div className="codePreformatBox">
                  {queryResponse && <pre>{queryResponse?.query}</pre>}
                </div>
              )} */}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                className="secondaryBtn"
                onClick={(e) => copyToClipboard(e, queryResponse?.query)}
              >
                {contentCopied === "Copy SQL" ? (
                  <>
                    SQL query Copied <CheckCircleOutlineIcon />
                  </>
                ) : (
                  "Copy SQL"
                )}
              </Button>
              {generateSql && (
                <Button
                  size="small"
                  className="primaryBtn"
                  onClick={()=>{
                    getNaturalData(false);
                    handleOpen();
                  }}
                >
                  View Statement
                </Button>
              )}
              {explainSql && (
                <Button
                  onClick={() => {
                    getNaturalData(true);
                    setClickExplainSql(true);
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
            {!loading ? (
              <>{renderContent(modalText)}</>
            ) : (
              <div className="codePreformatBox">
                <div className="shimmerCard">
                  <div className="shimmerBG title-line"></div>
                  <div className="shimmerBG title-line end"></div>
                  <div className="shimmerBG content-line m-t-24"></div>
                  <div className="shimmerBG content-line"></div>
                  <div className="shimmerBG content-line"></div>
                  <div className="shimmerBG content-line"></div>
                  <div className="shimmerBG content-line end"></div>
                </div>
              </div>
            )}
          </Box>
        </Modal>
      </Grid>
    </div>
  );
}

export default QueryBuilder;
