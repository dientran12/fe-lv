import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

function EditorComponent({ onChange }) {
    const handleEditorChange = (content, editor) => {
        console.log('Content was updated:', content);
        onChange(content);
    }

    return (
        <Editor
            apiKey="YOUR_TINY_CLOUD_API_KEY"  // Đăng ký tại tiny.cloud để nhận API key miễn phí
            initialValue=""
            init={{
                height: 400,
                menubar: false,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help'
            }}
            onEditorChange={handleEditorChange}
        />
    );
}

export default EditorComponent;
