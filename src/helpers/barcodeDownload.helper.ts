interface DownloadBarcodeProps {
    barcodeText: string;
    barcodeRef: React.RefObject<HTMLDivElement | null>;
    itemName: string;
}

export const downloadBarcode = (props: DownloadBarcodeProps) => {
    if (
        props.barcodeRef &&
        props.barcodeRef.current &&
        props.barcodeText
    ) {
        // Find the SVG element inside the barcode component
        const svgElement = props.barcodeRef.current.querySelector('svg');
        if (svgElement) {
            // Prefer SVG width/height attributes, fallback to getBoundingClientRect
            const svgWidth = Math.ceil(
                parseFloat(svgElement.getAttribute("width") || "") ||
                svgElement.getBoundingClientRect().width
            );
            const svgHeight = Math.ceil(
                parseFloat(svgElement.getAttribute("height") || "") ||
                svgElement.getBoundingClientRect().height
            );

            // Set up font for text
            const fontSize = 18;
            const fontFamily = "Arial, sans-serif";
            const textMargin = 8;

            // Create a canvas with extra space for text
            const canvas = document.createElement('canvas');
            canvas.width = svgWidth;
            canvas.height = svgHeight + fontSize + textMargin;
            const ctx = canvas.getContext('2d');

            // Convert SVG to image
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);

            // Use itemName if not empty, otherwise barcodeText
            const label = props.itemName !== "" ? props.itemName : props.barcodeText;

            const img = new window.Image();
            // Prevent CORS issues if possible:
            img.crossOrigin = "anonymous";
            img.onload = () => {
                if (ctx) {
                    // Fill background white (optional)
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Draw the barcode SVG
                    ctx.drawImage(img, 0, 0, svgWidth, svgHeight);

                    // Draw the label text below barcode
                    ctx.font = `${fontSize}px ${fontFamily}`;
                    ctx.fillStyle = "#222";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "top";
                    ctx.fillText(
                        label,
                        canvas.width / 2,
                        svgHeight + textMargin / 2
                    );
                } else {
                    console.error("Failed to get 2D context from canvas.");
                }

                // Download as PNG
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `${label}-barcode.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                    } else {
                        console.error("Failed to create blob from canvas.");
                    }
                }, "image/png");

                URL.revokeObjectURL(svgUrl);
            };
            img.onerror = (e) => {
                console.error("Could not load SVG as image", e);
                URL.revokeObjectURL(svgUrl);
            };
            img.src = svgUrl;
        }
    }
};