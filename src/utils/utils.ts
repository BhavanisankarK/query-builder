export function separateSQLAndNonSQL(input: string): string {
  // Define SQL keywords to identify SQL statements
  const sqlKeywords: string[] = [
    "SELECT",
    "FROM",
    "WHERE",
    "GROUP BY",
    "ORDER BY",
    "INSERT",
    "UPDATE",
    "DELETE",
    "CREATE",
    "DROP",
    "ALTER",
    "JOIN",
    "ON",
    "UNION",
    "EXCEPT",
    "INTERSECT",
  ];

  // Split the input string into lines
  const lines: string[] = input.split("\n").map((line) => line.trim());

  // Initialize the result object
  const result: string[] = [];

  // Function to check if a line contains any SQL keyword
  const isSQLLine = (line: string): boolean => {
    return sqlKeywords.some((keyword) =>
      line.toUpperCase().startsWith(keyword)
    );
  };

  // Track whether we are in an SQL block
  let inSQLBlock = false;
  let currentBlock: string[] = [];

  // Separate the lines into SQL and non-SQL categories
  lines.forEach((line) => {
    if (isSQLLine(line) || (inSQLBlock && line)) {
      if (!inSQLBlock) {
        // If starting a new SQL block, push any accumulated non-SQL block
        if (currentBlock.length > 0) {
          result.push(`<p>${currentBlock.join(" ")}</p>`);
          currentBlock = [];
        }
        inSQLBlock = true;
      }
      currentBlock.push(line);
    } else {
      if (inSQLBlock) {
        // If ending an SQL block, push the SQL block
        if (currentBlock.length > 0) {
          result.push(`<pre>${currentBlock.join("\n")}</pre>`);
          currentBlock = [];
        }
        inSQLBlock = false;
      }
      if (line) {
        currentBlock.push(line);
      }
    }
  });

  // Push any remaining block
  if (currentBlock.length > 0) {
    if (inSQLBlock) {
      result.push(`<pre>${currentBlock.join("\n")}</pre>`);
    } else {
      result.push(`<p>${currentBlock.join(" ")}</p>`);
    }
  }

  return result.join("\n");
}

