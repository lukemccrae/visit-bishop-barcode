import { useRef, useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import Barcode from "react-barcode";
import { downloadBarcode } from "./helpers/barcodeDownload.helper";

function App() {
  const [barcodeText, setBarcodeText] = useState("");
  const [itemName, setItemName] = useState("");
  const barcodeRef = useRef<HTMLDivElement | null>(null);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // vertical centering
        alignItems: "center", // horizontal centering
        minHeight: "100vh",
        width: '100vw'
      }}
    >
      <Container
        maxWidth="md"
        sx={{ py: 4, display: "flex", flexDirection: "column", flex: 1 }}
      >
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Barcode Generator
        </Typography>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Enter text for barcode"
              value={barcodeText}
              onChange={(e) => setBarcodeText(e.target.value)}
              placeholder="Enter text to generate barcode"
              variant="outlined"
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Enter item detail (replaces barcode text)"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter Item details"
              variant="outlined"
            />
          </Box>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent sx={{ textAlign: "center" }}>
              {barcodeText && (
                <Box ref={barcodeRef}>
                  <Barcode displayValue={false} value={barcodeText} />
                  <Typography>
                    {/* replace barcode text with custom detail */}
                    {itemName !== "" ? itemName : barcodeText}
                  </Typography>
                </Box>
              )}
              {barcodeText && (
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() =>
                    downloadBarcode({ barcodeText, itemName, barcodeRef })
                  }
                  sx={{ mt: 2 }}
                >
                  Download
                </Button>
              )}
            </CardContent>
          </Card>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[800]
              : theme.palette.grey[200],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="white" align="center">
            Created by{" "}
            <a
              href="https://github.com/lukemccrae"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              Luke McCrae
            </a>{" "}
            for{" "}
            <a
              href="https://bishopvisitor.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              https://bishopvisitor.com/
            </a>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
