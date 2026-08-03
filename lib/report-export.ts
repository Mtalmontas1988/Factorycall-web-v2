'use client';

export type ReportColumn = { label: string; value: string | number };
export type ReportRow = Record<string, string | number>;
export type ReportDocument = {
  title: string;
  subtitle: string;
  companyName: string;
  companyLogoUrl?: string;
  reportId: string;
  generatedAt: string;
  columns: ReportColumn[];
  rows: ReportRow[];
  signatureLabel: string;
};

const escape = (value: string | number) => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] ?? char));
const fileName = (title: string) => title.toLocaleLowerCase('lt-LT').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const download = (content: BlobPart, type: string, name: string) => { const url = URL.createObjectURL(new Blob([content], { type })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url); };

export function exportCsv(report: ReportDocument) {
  const rows = [report.columns.map(column => column.label), ...report.rows.map(row => report.columns.map(column => row[column.label] ?? ''))];
  const csv = `\uFEFF${rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\n')}`;
  download(csv, 'text/csv;charset=utf-8', `${fileName(report.title)}.csv`);
}

export function exportExcel(report: ReportDocument) {
  const header = report.columns.map(column => `<th>${escape(column.label)}</th>`).join('');
  const rows = report.rows.map(row => `<tr>${report.columns.map(column => `<td>${escape(row[column.label] ?? '')}</td>`).join('')}</tr>`).join('');
  const workbook = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"/></head><body><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></body></html>`;
  download(workbook, 'application/vnd.ms-excel;charset=utf-8', `${fileName(report.title)}.xls`);
}

export function printPdf(report: ReportDocument) {
  const popup = window.open('', '_blank', 'noopener,noreferrer');
  if (!popup) return;
  const header = report.columns.map(column => `<th>${escape(column.label)}</th>`).join('');
  const rows = report.rows.map(row => `<tr>${report.columns.map(column => `<td>${escape(row[column.label] ?? '')}</td>`).join('')}</tr>`).join('');
  const qrData = encodeURIComponent(`${report.reportId}|${report.generatedAt}|${report.title}`);
  popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escape(report.title)}</title><style>@page{size:A4;margin:15mm}*{box-sizing:border-box}body{font:12px Arial,sans-serif;color:#17212d}.head{display:flex;justify-content:space-between;gap:20px;border-bottom:3px solid #1477e9;padding-bottom:14px}.logos{display:flex;align-items:center;gap:14px}.logo{max-height:46px;max-width:180px;object-fit:contain}.company-logo{max-height:42px;max-width:120px;object-fit:contain}.muted{color:#607089}.meta{text-align:right}.qr{width:68px;height:68px}.section{margin-top:22px}.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0}.summary div{border:1px solid #d6deea;padding:10px;border-radius:6px}.summary b{display:block;font-size:16px;color:#1477e9}table{width:100%;border-collapse:collapse;margin-top:12px}th{background:#172b44;color:#fff;text-align:left;padding:9px}td{padding:8px;border-bottom:1px solid #dfe6ee;vertical-align:top}.signature{margin-top:42px;display:flex;justify-content:flex-end}.signature div{width:220px;border-top:1px solid #596879;padding-top:8px;text-align:center}.footer{position:fixed;bottom:0;left:0;right:0;font-size:9px;color:#607089;display:flex;justify-content:space-between}@media print{.footer:after{content:'FactoryCall | Puslapis ' counter(page)}}</style></head><body><header class="head"><div class="logos"><img class="logo" src="${window.location.origin}/brand/factorycall-logo.png" alt="FactoryCall"/>${report.companyLogoUrl ? `<img class="company-logo" src="${escape(report.companyLogoUrl)}" alt="${escape(report.companyName)}"/>` : ''}</div><div class="meta"><img class="qr" src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}" alt="QR"/><div>${escape(report.reportId)}</div></div></header><main><section class="section"><h1>${escape(report.title)}</h1><p class="muted">${escape(report.subtitle)}</p><div class="summary"><div><span class="muted">Įmonė</span><b>${escape(report.companyName)}</b></div><div><span class="muted">Sugeneruota</span><b>${escape(report.generatedAt)}</b></div><div><span class="muted">Įrašai</span><b>${report.rows.length}</b></div></div></section><section class="section"><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></section><section class="signature"><div>${escape(report.signatureLabel)}</div></section></main><footer class="footer"><span>FactoryCall</span><span>${escape(report.reportId)}</span></footer><script>window.onload=()=>window.print();</script></body></html>`);
  popup.document.close();
}
