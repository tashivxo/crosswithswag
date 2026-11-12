const PAYFAST_PROCESS = new Set([
  "https://sandbox.payfast.co.za/eng/process",
  "https://www.payfast.co.za/eng/process",
]);

export function isPayfastProcessUrl(url: string): boolean {
  return PAYFAST_PROCESS.has(url);
}

export function submitPayfastForm(
  redirectUrl: string,
  vendorFields: Record<string, string>,
  doc: Document = document,
): void {
  if (!isPayfastProcessUrl(redirectUrl)) {
    throw new Error("unexpected payfast url");
  }
  const form = doc.createElement("form");
  form.method = "POST";
  form.action = redirectUrl;
  form.acceptCharset = "UTF-8";
  for (const [name, value] of Object.entries(vendorFields)) {
    if (!name) continue;
    const input = doc.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  doc.body.appendChild(form);
  form.submit();
}
