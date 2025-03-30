import { NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import fsPromises from 'fs/promises';
import FormData from 'form-data';
import { SERVER_URL } from '../../../utils/consts';

export const config = {
  api: {
    bodyParser: false
  }
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = (file as File).name;
    const tempFilePath = `/tmp/${fileName}`;
    await fsPromises.writeFile(tempFilePath, new Uint8Array(fileBuffer));

    const externalFormData = new FormData();
    externalFormData.append('file', fs.createReadStream(tempFilePath));

    const response = await axios.post(SERVER_URL, externalFormData, {
      headers: {
        ...externalFormData.getHeaders()
      }
    });

    await fsPromises.unlink(tempFilePath);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'File upload failed', details: error.message }, { status: 500 });
  }
}
