"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSV = void 0;
const fs_1 = require("fs");
class CSV {
    static parseCsv(csvPath) {
        let csvData = (0, fs_1.readFileSync)(csvPath, 'utf-8');
        let csvLines = csvData.split("\n");
        let csvArrayData = [];
        for (let row of csvLines) {
            let rowData = [];
            for (let obj of row.split(",")) {
                rowData.push(obj);
            }
            csvArrayData.push(rowData);
        }
        return csvArrayData;
    }
    static csvToNamesText(csvData, column, condition = null) {
        let namesText = "";
        for (let data of csvData) {
            let conditionValue = true;
            if (condition) {
                conditionValue = condition(data);
            }
            console.log(conditionValue);
            if (conditionValue) {
                namesText += data[column] + "\n";
            }
        }
        return namesText;
    }
    static csvFileToTextFile(csvPath, textOut, column, condition = null) {
        let csvData = this.parseCsv(csvPath);
        let textData = this.csvToNamesText(csvData, column, condition);
        (0, fs_1.writeFileSync)(textOut, textData);
    }
}
exports.CSV = CSV;
