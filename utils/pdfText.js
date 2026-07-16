const { PDFParse } = require('pdf-parse');


async function extractResumeText(resumeUrl) {
	const parser = new PDFParse({ url: resumeUrl });

	const result = await parser.getText();
	return result.text;
}

module.exports = { extractResumeText };