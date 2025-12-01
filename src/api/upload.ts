import apiClient from '../lib/api';

// 파일 업로드 요청 타입
export interface UploadFileRequest {
    att_target_type?: string; // 기본값: 'ETC'
    att_target?: string; // 기본값: '0'
}

// 업로드된 파일 정보 타입
export interface UploadedFile {
    att_idx: number;
    att_original_name: string;
    att_saved_name: string;
    att_path: string;
    att_size: number;
    att_target_type: string;
    att_target: string;
    created_at: string;
}

// 파일 업로드 응답 타입
export interface UploadFileResponse {
    files: UploadedFile[];
    message?: string;
}

export const uploadApi = {
    /**
     * 파일 업로드
     * @param directory 업로드할 디렉토리 경로
     * @param files 업로드할 파일들
     * @param options 추가 옵션 (att_target_type, att_target)
     * @returns 업로드된 파일 정보 배열
     */
    uploadFiles: async (
        directory: string,
        files: File[],
        options?: UploadFileRequest
    ): Promise<UploadFileResponse> => {
        const formData = new FormData();
        
        // 파일들을 FormData에 추가 (백엔드에서 'files' 필드명으로 받음)
        files.forEach((file) => {
            formData.append('files', file);
        });

        // 추가 옵션 추가
        if (options?.att_target_type) {
            formData.append('att_target_type', options.att_target_type);
        }
        if (options?.att_target) {
            formData.append('att_target', options.att_target);
        }

        const response = await apiClient.post<UploadFileResponse>(
            `/uploads/${directory}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    /**
     * 파일 삭제
     * @param attIdx 삭제할 파일의 첨부파일 ID
     * @returns 삭제 결과
     */
    deleteFile: async (attIdx: number): Promise<{ message: string }> => {
        const response = await apiClient.delete<{ message: string }>(
            `/uploads/${attIdx}`
        );
        return response.data;
    },
};
