import React, { useState } from 'react';

export const PrintTest = () => {
    const [person, setPerson] = useState({ name: "shehan", age: 25 });

    function printMySheet(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        const printContent = document.getElementById('print-area');
        const windowUrl = 'about:blank';
        const printWindow = window.open(windowUrl, '_blank');

        // Generate QR code with person's data
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=V261&size=100x100`;

        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print</title>
                        <style>
                            body { 
                                font-family: Arial, sans-serif; 
                                margin: 1cm;
                            }
                            .print-content {
                                border: 1px solid #ddd;
                                padding: 20px;
                                max-width: 800px;
                                margin: 0 auto;
                            }
                            .print-header {
                                font-size: 24px;
                                margin-bottom: 20px;
                                color: #333;
                                text-align: center;
                            }
                            .print-row {
                                margin-bottom: 10px;
                            }
                            .qr-container {
                                text-align: center;
                                margin: 20px 0;
                            }
                            .qr-code {
                                width: 100px;
                                height: 100px;
                                display: inline-block;
                            }
                            .details-container {
                                display: flex;
                                justify-content: space-between;
                            }
                            .person-details {
                                flex: 1;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="print-content">
                            <div class="print-header">Person Details</div>
                            <div class="details-container">
                                <div class="person-details">
                                    ${printContent?.innerHTML}
                                </div>
                                <div class="qr-container">
                                    <img class="qr-code" src="${qrCodeUrl}" alt="QR Code" />
                                    <p>Scan this QR code for details</p>
                                </div>
                            </div>
                        </div>
                        <script>
                            window.onload = function() {
                                setTimeout(function() {
                                    window.print();
                                    window.close();
                                }, 300);
                            }
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    }

    return (
        <div>
            <h1>PrintTest</h1>
            <button onClick={printMySheet}>Print person</button>

            {/* This div is hidden on screen but will be printed */}
            <div id="print-area" style={{ display: 'none' }}>
                <div className="print-row"><strong>Name:</strong> {person.name}</div>
                <div className="print-row"><strong>Age:</strong> {person.age}</div>
                <div className="print-row"><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
            </div>
        </div>
    );
};