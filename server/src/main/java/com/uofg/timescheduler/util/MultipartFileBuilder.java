package com.uofg.timescheduler.util;

import ch.qos.logback.core.util.FileSize;
import cn.hutool.core.io.FileTypeUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.text.UnicodeUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@Slf4j
public class MultipartFileBuilder {

    private MultipartHttpServletRequest multipartHttpServletRequest;
    /**
     * Limit the size of uploaded files
     */
    private long maxSize = 0;
    /**
     * Field Name
     */
    private Set<String> fieldNames = new HashSet<>();
    /**
     * Multiple file upload
     */
    private boolean multiple;
    /**
     * File name suffix
     */
    private String[] fileExt;
    /**
     * file type
     */
    private String contentTypePrefix;
    /**
     * File stream type
     */
    private String[] inputStreamType;
    /**
     * save path
     */
    private String savePath;
    /**
     * if should use original file name
     */
    private boolean useOriginalFilename;

    public MultipartFileBuilder(MultipartHttpServletRequest multipartHttpServletRequest) {
        Objects.requireNonNull(multipartHttpServletRequest);
        this.multipartHttpServletRequest = multipartHttpServletRequest;
    }

    /**
     * File upload size limit
     *
     * @param maxSize Byte size
     * @return this
     */
    public MultipartFileBuilder setMaxSize(long maxSize) {
        this.maxSize = maxSize;
        return this;
    }

    /**
     * File upload size limit
     *
     * @param maxSize string
     * @return this
     */
    public MultipartFileBuilder setMaxSize(String maxSize) {
        this.maxSize = FileSize.valueOf(maxSize).getSize();
        return this;
    }

    /**
     * Whether to use the original file name to save
     *
     * @param useOriginalFilename true Yes
     */
    public MultipartFileBuilder setUseOriginalFilename(boolean useOriginalFilename) {
        this.useOriginalFilename = useOriginalFilename;
        return this;
    }

    /**
     * Required file fields
     *
     * @param fieldName Param name
     * @return this
     */
    public MultipartFileBuilder addFieldName(String fieldName) {
        this.fieldNames.add(fieldName);
        return this;
    }

    /**
     * if uploading multiple files one time
     *
     * @param multiple true
     * @return this
     */
    public MultipartFileBuilder setMultiple(boolean multiple) {
        this.multiple = multiple;
        return this;
    }

    /**
     * Restrict file extension
     *
     * @param fileExt file extension
     * @return this
     */
    public MultipartFileBuilder setFileExt(String... fileExt) {
        this.fileExt = fileExt;
        return this;
    }

    /**
     * Restrict file stream type
     *
     * @param inputStreamType type
     * @return this
     * @see FileTypeUtil#getType(java.io.InputStream)
     */
    public MultipartFileBuilder setInputStreamType(String... inputStreamType) {
        this.inputStreamType = inputStreamType;
        return this;
    }

    /**
     * Use to get the type
     *
     * @param contentTypePrefix Prefix
     * @return this
     * @see java.nio.file.Files#probeContentType(java.nio.file.Path)
     */
    public MultipartFileBuilder setContentTypePrefix(String contentTypePrefix) {
        this.contentTypePrefix = contentTypePrefix;
        return this;
    }

    private boolean isResolvableFile(InputStream inp, String fileName) {
        return Arrays.stream(this.fileExt)
                .anyMatch(ext -> {
                    switch (ext) {
                        case "xls":
                        case "xlsx":
                            try {
                                if (WorkbookFactory.create(inp) != null) {
                                    log.info(fileName + " : GOOD FILE");
                                    return true;
                                } else {
                                    log.error(fileName + " : invalid input file Or Not a valid Excel file");
                                    return false;
                                }
                            } catch (Exception e1) {
//                                e1.printStackTrace();
                                log.error(fileName + " : invalid input file Or Not a valid Excel file");
                                return false;
                            }
                        default:
                            return false;
                    }
                });
    }

    /**
     * the path where the file is saved
     *
     * @param savePath path
     * @return this
     */
    public MultipartFileBuilder setSavePath(String savePath) {
        this.savePath = savePath;
        return this;
    }

    private void checkSaveOne() {
        if (this.fieldNames.size() != 1) {
            throw new IllegalArgumentException(
                    "Field names size error: " + this.fieldNames.size()
                            + " fields need to save, but only one is allowed.");
        }
        if (this.multiple) {
            throw new IllegalArgumentException(
                    "Field names size error: multiple fields need to be saved, but only one is allowed.");
        }
    }

    /**
     * save one file
     *
     * @return local path
     * @throws IOException IO
     */
    public String save() throws IOException {
        checkSaveOne();
        String[] paths = saves();
        return paths[0];
    }

    /**
     * save multiple files
     *
     * @return array of local paths
     * @throws IOException IO
     */
    public String[] saves() throws IOException {
        if (fieldNames.isEmpty()) {
            throw new IllegalArgumentException("Field name error: empty field name in FormData.");
        }
        String[] paths = new String[fieldNames.size()];
        int index = 0;
        for (String fieldName : fieldNames) {
            if (this.multiple) {
                List<MultipartFile> multipartFiles = multipartHttpServletRequest.getFiles(fieldName);
                for (MultipartFile multipartFile : multipartFiles) {
                    paths[index++] = saveAndName(multipartFile)[0];
                }
            } else {
                MultipartFile multipartFile = multipartHttpServletRequest.getFile(fieldName);
                paths[index++] = saveAndName(multipartFile)[0];
            }
        }
        return paths;
    }

    /**
     * Upload the file and return the original file name
     *
     * @return array
     * @throws IOException IO
     */
    public String[] saveAndName() throws IOException {
        checkSaveOne();
        List<String[]> list = saveAndNames();
        return list.get(0);
    }

    /**
     * Upload the files and return the original file name
     *
     * @return list
     * @throws IOException IO
     */
    public List<String[]> saveAndNames() throws IOException {
        if (fieldNames.isEmpty()) {
            throw new IllegalArgumentException("Field name error: empty field name in FormData.");
        }
        List<String[]> list = new ArrayList<>();
        for (String fieldName : fieldNames) {
            if (this.multiple) {
                List<MultipartFile> multipartFiles = multipartHttpServletRequest.getFiles(fieldName);
                for (MultipartFile multipartFile : multipartFiles) {
                    String[] info = saveAndName(multipartFile);
                    list.add(info);
                }
            } else {
                MultipartFile multipartFile = multipartHttpServletRequest.getFile(fieldName);
                String[] info = saveAndName(multipartFile);
                list.add(info);
            }
        }
        return list;
    }

    /**
     * save a file and validate its type
     *
     * @param multiFile file
     * @return Local path and original file name
     * @throws IOException IO
     */
    private String[] saveAndName(MultipartFile multiFile) throws IOException {
        String fileName = multiFile.getOriginalFilename();
        if (StrUtil.isEmpty(fileName)) {
            throw new IllegalArgumentException("File name error: cannot get file name.");
        }
        long fileSize = multiFile.getSize();
        if (fileSize <= 0) {
            throw new IllegalArgumentException("File size error: empty content.");
        }
        // file extension
        if (this.fileExt != null) {
            String checkName = fileName.toLowerCase();
            boolean find = false;
            for (String ext : this.fileExt) {
                find = checkName.endsWith("." + ext.toLowerCase());
                if (find) {
                    break;
                }
            }
            if (!find) {
                throw new IllegalArgumentException("File extension error: " + checkName + " has an illegal extension.");
            }
        }
        // file size
        if (maxSize > 0 && fileSize > maxSize) {
            throw new IllegalArgumentException("File size error: file is too big, " + fileSize + ">" + maxSize);
        }
        // file stream type
        InputStream inputStream = multiFile.getInputStream();
        if (this.inputStreamType != null) {
            String fileType = FileTypeUtil.getType(inputStream);
            for (String type : this.inputStreamType) {
                if (type.equalsIgnoreCase(fileType)) {
                    continue;
                }
                throw new IllegalArgumentException(
                        "Input stream type error: " + fileType + " does not suit " + type + ".");
            }
        }
        if (!isResolvableFile(inputStream, fileName)) {
            throw new IllegalArgumentException("File parse error: file cannot be parsed.");
        }
        // path where the file is saved
        String localPath = Objects.requireNonNullElse(this.savePath, "/tmp");
        // Saved file name
        String filePath;
        if (useOriginalFilename) {
            filePath = FileUtil.normalize(String.format("%s/%s", localPath, fileName));
        } else {
            // Prevent Chinese error code
            String saveFileName = UnicodeUtil.toUnicode(fileName);
            // generate unique id
            filePath = FileUtil.normalize(String.format("%s/%s_%s", localPath, IdUtil.objectId(), saveFileName));
        }
        FileUtil.writeFromStream(multiFile.getInputStream(), filePath);
        // file content Type
        if (this.contentTypePrefix != null) {
            Path source = Paths.get(filePath);
            String contentType = Files.probeContentType(source);
            if (contentType == null) {
                // auto delete files
                FileUtil.del(filePath);
                throw new IllegalArgumentException("Content type prefix error: failed to get file type.");
            }
            if (!contentType.startsWith(contentTypePrefix)) {
                // auto delete files
                FileUtil.del(filePath);
                throw new IllegalArgumentException("Content type prefix error: " + contentType);
            }
        }
        return new String[]{filePath, fileName};
    }
}
