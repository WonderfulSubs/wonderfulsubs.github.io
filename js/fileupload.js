// var contentInfoContainer = document.getElementById('content-info-container');

var openFile = function (event, callback) {
    try {
        var fileSizeLimit = 104857600; // 100 MB
        var files = event.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var fileType = file.type;
            var fileSize = file.size;
            if (fileSize > fileSizeLimit) return alert('File is too large (Max 100MB)');

            // var progressPercent = document.createElement('div');
            // progressPercent.className = 'progress-percentage';

            // var progressBarContainer = document.createElement('div');
            // progressBarContainer.className = 'progress-bar-container';

            // var progressBar = document.createElement('div');
            // progressBar.className = 'progress-bar';
            // progressBarContainer.appendChild(progressBar);

            // var contentInfo = document.createElement('div');
            // contentInfo.className = 'content-info';

            // var itemContainer = document.createElement('div');
            // if (i % 2) itemContainer.className = 'odd';
            // itemContainer.appendChild(progressPercent);
            // itemContainer.appendChild(progressBarContainer);
            // itemContainer.appendChild(contentInfo);

            // contentInfoContainer.appendChild(itemContainer);

            m.request({
                url: 'https://cdn.wonderfulsubs.com/media/start',
                headers: {
                    'content-type': fileType
                }
            })
                .then(function(json) {
                    if (json.success !== true) throw Error;
                    var id = json.id;
                    var chunkSize = json.chunk_size;
                    var offset = 0;
                    var self = this; // we need a reference to the current object
                    var chunkReaderBlock = null;
                    var percentStr = '0%';
                    // progressPercent.innerHTML = percentStr;
                    // progressBar.style.width = percentStr;

                    chunkReaderBlock = function (_offset, length, _file) {
                        var reader = new FileReader();
                        var blob = _file.slice(_offset, length + _offset);
                        reader.readAsArrayBuffer(blob);
                        reader.onload = function () {
                            var buffer = reader.result;
                            uploadBlob(buffer);
                        }
                    }

                    function uploadBlob(buffer) {
                        var isLastChunk = (offset + chunkSize) >= fileSize;
                        m.request({
                            url: 'https://cdn.wonderfulsubs.com/media/upload/' + id,
                            method: 'POST',
                            body: buffer,
                            serialize: function (body) { return body; },
                            headers: {
                                'content-type': fileType,
                                offset: offset,
                                final: isLastChunk ? 'true' : 'false'
                            },
                            extract: function (res) {
                                if (res.status >= 500 && res.status <= 599) {
                                    m.request({
                                        url: 'https://cdn.wonderfulsubs.com/media/query/' + id,
                                        headers: {
                                            'content-type': fileType
                                        }
                                    })
                                        .then(function(json) {
                                            chunkReaderBlock(json.offset, json.chunk_size, file);
                                        });
                                    return;
                                }
                                if (res.status >= 400 && res.status <= 499) {
                                    var err = new Error;
                                    err.status = res.status;
                                    throw err;
                                }

                                return JSON.parse(res.responseText);
                            }
                        })
                            .then(function(json) {
                                var percent = Math.round(((offset + buffer.byteLength) / fileSize) * 100);
                                var percentStr = percent + '%';
                                // progressPercent.innerHTML = percentStr;
                                // progressBar.style.width = percentStr;
                                var contentId = json.content_id;

                                if (isLastChunk) {
                                    var isImage = fileType.indexOf('image/') === 0;
                                    var url = 'https://cdn.wonderfulsubs.com/' + (isImage ? 'image' : 'video') + '/' + contentId;
                                    var urlHTML = '<br><span>Direct Link: <a class="media-direct-link" href="' + url + '">' + url + '</a></span>';
                                    if (isImage) {
                                        callback(undefined, 'https://cdn.wonderfulsubs.com/image/' + contentId);
                                        // contentInfo.innerHTML = '<img src="/image/' + contentId + '"/>' + urlHTML;
                                    } else {
                                        // contentInfo.innerHTML = 'Processing video...';
                                        var checkStatus = setInterval(function() {
                                            m.request('https://cdn.wonderfulsubs.com/media/status/' + contentId)
                                                .then(function(json) {
                                                    if (json.status === 'SUCCESS') {
                                                        clearInterval(checkStatus);
                                                        callback(undefined, 'https://cdn.wonderfulsubs.com/video/' + contentId);
                                                        // contentInfo.innerHTML = '<video src="/video/' + contentId + '" controls></video>' + urlHTML;
                                                    } else if (json.status === 'FAILED' || json.status === 'UNKNOWN') {
                                                        throw Error;
                                                    }
                                                })
                                                .catch(function(error) {
                                                    clearInterval(checkStatus);
                                                    callback(error);
                                                    // contentInfo.innerHTML = '<br><div>Error: Video could not be loaded</div>';
                                                });
                                        }, 5000);
                                    }
                                    return;
                                } else {
                                    offset += chunkSize;
                                }
                                chunkReaderBlock(offset, chunkSize, file);
                            })
                            .catch(function(error) {
                                if (error.status >= 400 && error.status <= 499) {
                                    callback(error);
                                    // progressPercent.innerHTML = 'Status: Failed';
                                    // contentInfo.innerHTML = 'An Error Occured';
                                }
                            });
                    }

                    // now let's start the read with the first block
                    chunkReaderBlock(offset, chunkSize, file);
                })
                .catch(function(error) {
                    callback(error);
                });
        }
    } catch (error) {
        callback(error);
    }
};