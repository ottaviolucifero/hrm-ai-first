package com.odsoftware.hrm.dto.masterdata.global;

import java.util.List;

public record ItalianZipCodeImportReport(
		long rowsRead,
		long totalValidSourceZipCodes,
		long imported,
		long updated,
		long skipped,
		long errors,
		List<String> errorDetails) {
}
