import { Visit } from "../types/visit";

export const CsvService = {
    downloadAsCsvFile: (anyList: any[], filename: string = 'data.csv') => {
        if (!anyList || anyList.length === 0) return;

        const keys = Object.keys(anyList[0]);
        const csvRows = [
            keys.join(','), // header
            ...anyList.map(row =>
                keys.map(k => `"${(row[k] ?? '').toString().replace(/"/g, '""')}"`).join(',')
            )
        ];
        const csvContent = csvRows.join('\r\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },


    downloadVisitsAsCsvFile: (visitList: Visit[], filename: string = 'data.csv') => {
        if (!visitList || visitList.length === 0) return;

        // Define the CSV headers
        const headers = [
            'visitId',
            'VisitOptionName',
            'visitorId',
            'visitorName',
            'email',
            'visitDate',
            'VisitTime'
        ];

        // Process each visit to extract the required data
        const csvRows = visitList.map(visit => {
            return {
                visitId: visit.id ?? '',
                VisitOptionName: visit.visitOption?.visitOptionName ?? '',
                visitorId: visit.visitor?.id ?? '',
                visitorName: `${visit.visitor?.firstName ?? ''} ${visit.visitor?.lastName ?? ''}`.trim(),
                email: visit.visitor?.email ?? '',
                visitDate: visit.visitRow?.date ?? '',
                VisitTime: visit.visitRow?.startTime ?? ''
            };
        });

        // Create CSV content
        const csvContent = [
            headers.join(','), // header row
            ...csvRows.map(row =>
                headers.map(header =>
                    `"${(row[header as keyof typeof row] ?? '').toString().replace(/"/g, '""')}"`
                ).join(',')
            )
        ].join('\r\n');

        // Download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}