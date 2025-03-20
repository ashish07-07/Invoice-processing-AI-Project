"use client";
import { useState } from "react";
import axios from "axios";

export default function FileUpload() {
    const [currentfile, setcurfile] = useState<File | null>(null);
    const [uploading, setuploading] = useState(false);
    const [response, setresponse] = useState<any>(null);

    async function handlesubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!currentfile) {
            console.log("No file has been passed");
            return;
        }

        try {
            setuploading(true);
            const formdata = new FormData();
            formdata.append("file", currentfile);

            const res = await axios.post('/api/fileupload', formdata, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            console.log("Response from backend:", res.data);
            setresponse(res.data);
        } catch (e) {
            console.error("Upload error:", e);
            setresponse({ error: "Failed to upload file" });
        } finally {
            setuploading(false);
        }
    }

    function fileinput(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        setcurfile(file || null);
    }

    return (
        <div>
            <h2>Invoice Details Project</h2>
            <form onSubmit={handlesubmit}>
                <input type="file" onChange={fileinput} />
                <button type="submit" disabled={uploading}>
                    {uploading ? "Uploading..." : "Submit"}
                </button>
            </form>

            {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        </div>
    );
}
