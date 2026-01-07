# Briefly PDF

**Briefly PDF** is an intelligent document summarization tool powered by Google's **Gemini 3 Flash** model. It allows users to transform lengthy PDF documents, such as books, journals, and articles into digestible summaries with precise control over the output length.

## 🚀 Features

*   **Flexible Input**: 
    *   **Drag & Drop**: Upload local PDF files directly from your computer.
    *   **URL Import**: Fetch PDFs directly from web links.
*   **Adjustable Granularity**: Use the intuitive slider to control the summary length from **10% (Concise)** to **90% (Comprehensive)**.
    *   *Concise*: High-level takeaways and conclusions.
    *   *Balanced*: Key arguments, methodology, and evidence.
    *   *Detailed*: Abridged version retaining nuances and examples.
*   **Rich Markdown Output**: Summaries are formatted with proper headers, bullet points, and paragraphs for maximum readability.
*   **Export Options**:
    *   Copy summary to clipboard.
    *   Download summary as a Markdown (`.md`) file.
*   **Modern UI**: A clean, responsive interface built with React and Tailwind CSS.

## 🛠️ Technology Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **AI Model**: Google Gemini API (`gemini-3-flash-preview`)
*   **PDF Handling**: Native browser APIs (FileReader, Fetch)
*   **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

*   Node.js installed on your machine.
*   A Google Cloud Project with the **Gemini API** enabled.
*   An API Key from Google AI Studio.

### Installation

1.  **Clone the repository** (or download the source code):
    ```bash
    git clone <repository-url>
    cd briefly-pdf
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the application**:
    ```bash
    npm start
    ```
    The app should now be running on `http://localhost:3000` (or similar).

## 💡 How It Works

1.  **Select a File**: Drag a PDF into the upload zone or paste a direct link to a PDF.
2.  **Set Preference**: (Optional) Adjust the percentage slider to tell the AI how much detail you want.
3.  **Summarize**: Click the "Summarize PDF" button.
4.  **Review**: The AI analyzes the document text and generates a summary based on your constraints.
5.  **Refine**: If the summary is too short or too long, simply adjust the slider and click "Regenerate" without re-uploading the file.

## ⚠️ Limitations

*   **PDF Type**: The application relies on extracting text from PDFs. It works best with text-based PDFs. Scanned image-based PDFs may yield poor results or require OCR (not currently implemented).
*   **File Size**: Large files may hit browser or API token limits depending on the specific model constraints.
*   **CORS**: When using the URL import feature, the target server must allow Cross-Origin Resource Sharing (CORS) requests. If a URL fails, try downloading the file and uploading it manually.

## 📄 License

This project is open-source and available under the MIT License.
