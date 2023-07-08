const fs = require('fs');
const AWS = require('aws-sdk');
const UglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');
const path = require('path');



function Minify() {
    this.js = [];
    this.css = [];
    this.output = [];
    this.aws_details = 0;
    /**
     * AWS Details
     * {
     *     ACCESS_KEY:"Your Access Key",
     *     SECRET_KEY:"Your Secret Key",
     *     BUCKET:"Your Bucket Name"
     * }
     */
    this.old_path = '/';
    this.new_path = '/';

    this.old_local_path = '/';
    this.new_local_path = '/';
    this.path_status = 0;
    this.local_path_status = 0;
    this.s3_status = 0;

}

Minify.prototype.add_js = function (item) {
    this.js.push(item);
    return this;
};

Minify.prototype.add_css = function (item) {
    this.css.push(item);
    return this;
};

Minify.prototype.path_replace = function (old_path, new_path) {
    this.path_status = 1;
    this.old_path = old_path;
    this.new_path = new_path;
    return this;
};

Minify.prototype.local_path_replace = function (old_local_path, new_local_path) {
    this.local_path_status = 1;
    this.old_local_path = old_local_path;
    this.new_local_path = new_local_path;
    return this;
};

Minify.prototype.s3 = function (details) {
    this.aws_details = details;
    this.s3_status = 1;
    return this;
};



Minify.prototype.minify = function () {

    console.log('\x1b[32m%s\x1b[0m', 'Process Started')
    // Set the input and output file paths
    var inputFile = 'input.txt';
    var outputFile = 'output.txt';
    var up_path = "";

    if (this.css.length > 0) {
        for (let p = 0; p < this.css.length; p++) {
            // Read the input file
            inputFile = this.css[p];
            const input = fs.readFileSync(inputFile, 'utf8');
            outputFile = inputFile.replace('.css', '.min.css')
            // Remove all spaces and new lines
            const result = new CleanCSS().minify(input);
            // Write the output to the output file

            if (this.local_path_status) {
                var up_path = outputFile.replace(this.old_local_path, this.new_local_path)
            } else {
                var up_path = outputFile
            }

            console.log('\x1b[36m%s\x1b[0m', "          " + up_path)
            // Extract the directory path from the file path
            const directoryPath = path.dirname(up_path);

            // Create the directory if it doesn't exist
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
            }

           

            fs.writeFileSync(up_path, result.styles, 'utf8');
            if (this.s3_status) {
                const s3 = new AWS.S3({
                    accessKeyId: this.aws_details.ACCESS_KEY,
                    secretAccessKey: this.aws_details.SECRET_KEY
                });
                if (this.local_path_status) {
                    var up_path_out = outputFile.replace(this.old_local_path, this.new_local_path)
                } else {
                    var up_path_out = outputFile
                }

                let fileContent = fs.readFileSync(up_path_out);
                if (this.path_status) {
                    var up_path = outputFile.replace(this.old_path, this.new_path)
                } else {
                    var up_path = outputFile
                }

                
                let params = {
                    Bucket: this.aws_details.BUCKET,
                    Key: up_path,
                    Body: fileContent,
                    ContentType: 'text/css'
                };

                s3.upload(params, function (err, data) {
                    if (err) {
                        console.log('\x1b[31m%s\x1b[0m', "Error uploading file:", err);
                    } else {
                        console.log('\x1b[36m%s\x1b[0m', "File uploaded successfully. Location:", data.Location);
                    }
                });
            }


        }

    }

    if (this.js.length > 0) {
        for (let p = 0; p < this.js.length; p++) {
            // Read the input file
            inputFile = this.js[p];
            const input = fs.readFileSync(inputFile, 'utf8');
            outputFile = inputFile.replace('.js', '.min.js')
            
            // Remove all spaces and new lines
            const result = UglifyJS.minify(input);
            // Write the output to the output file
            if (this.local_path_status) {
                var up_path = outputFile.replace(this.old_local_path, this.new_local_path)
            } else {
                var up_path = outputFile
            }

            console.log('\x1b[36m%s\x1b[0m', "          " + up_path)
            // Extract the directory path from the file path
            const directoryPath = path.dirname(up_path);

            // Create the directory if it doesn't exist
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
            }
            fs.writeFileSync(up_path, result.code, 'utf8');
            if (this.s3_status) {
                const s3 = new AWS.S3({
                    accessKeyId: this.aws_details.ACCESS_KEY,
                    secretAccessKey: this.aws_details.SECRET_KEY
                });


                if (this.path_status) {
                    var up_path = outputFile.replace(this.old_path, this.new_path)
                } else {
                    var up_path = outputFile
                }

                if (this.local_path_status) {
                    var up_path_out = outputFile.replace(this.old_local_path, this.new_local_path)
                } else {
                    var up_path_out = outputFile
                }

                let fileContent = fs.readFileSync(up_path_out);
                // let fileContent = fs.readFileSync(up_path);
                let params = {
                    Bucket: this.aws_details.BUCKET,
                    Key: up_path,
                    Body: fileContent,
                    ContentType: 'application/javascript'
                };

                s3.upload(params, function (err, data) {
                    if (err) {
                        console.log('\x1b[31m%s\x1b[0m', "Error uploading file:", err);
                    } else {
                        console.log('\x1b[36m%s\x1b[0m', "File uploaded successfully. Location:", data.Location);
                    }
                });
            }

        }
    }


    console.log('\x1b[7m%s\x1b[0m', 'Files Minified successfully.');
    return "Success";
};

module.exports = Minify;
