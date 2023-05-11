const fs = require('fs');
const AWS = require('aws-sdk');



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
    this.path_status = 0;
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

Minify.prototype.path_replace = function (old_path,new_path) {
    this.path_status = 1;
    this.old_path=old_path;
    this.new_path=new_path;
    return this;
};

Minify.prototype.s3 = function (details) {
    this.aws_details = details;
    this.s3_status=1;
    return this;
};



Minify.prototype.minify = function () {

    console.log('\x1b[32m%s\x1b[0m', 'Process Started')
    // Set the input and output file paths
    var inputFile = 'input.txt';
    var outputFile = 'output.txt';
    var up_path="";

    if (this.css.length > 0) {
        for (let p = 0; p < this.css.length; p++) {
            // Read the input file
            inputFile = this.css[p];
            const input = fs.readFileSync(inputFile, 'utf8');
            outputFile = inputFile.replace('.css', '.min.css')
            console.log('\x1b[36m%s\x1b[0m', "          " + outputFile)
            // Remove all spaces and new lines
            const output = input.replace(/\s+/g, '');
            // Write the output to the output file
            fs.writeFileSync(outputFile, output, 'utf8');
            if(this.s3_status){
                const s3 = new AWS.S3({
                    accessKeyId: this.aws_details.ACCESS_KEY,
                    secretAccessKey: this.aws_details.SECRET_KEY
                });
    
                let fileContent = fs.readFileSync(outputFile);
                if(this.path_status){
                    var up_path=outputFile.replace(this.old_path,this.new_path)
                }else{
                    var up_path=outputFile
                }
                let params = {
                    Bucket: this.aws_details.BUCKET,
                    Key: up_path,
                    Body: fileContent,
                    ContentType: 'text/css'
                };
    
                s3.upload(params, function (err, data) {
                    if (err) {
                        console.log('\x1b[31m%s\x1b[0m',"Error uploading file:", err);
                    } else {
                        console.log('\x1b[36m%s\x1b[0m',"File uploaded successfully. Location:", data.Location);
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
            console.log('\x1b[36m%s\x1b[0m', "          " + outputFile)
            // Remove all spaces and new lines
            const output = input.replace(/\s+/g, '');
            // Write the output to the output file
            fs.writeFileSync(outputFile, output, 'utf8');
            if(this.s3_status){
                const s3 = new AWS.S3({
                    accessKeyId: this.aws_details.ACCESS_KEY,
                    secretAccessKey: this.aws_details.SECRET_KEY
                });
    
                let fileContent = fs.readFileSync(outputFile);
                if(this.path_status){
                    var up_path=outputFile.replace(this.old_path,this.new_path)
                }else{
                    var up_path=outputFile
                }
                let params = {
                    Bucket: this.aws_details.BUCKET,
                    Key: up_path,
                    Body: fileContent,
                    ContentType: 'application/javascript'
                };
    
                s3.upload(params, function (err, data) {
                    if (err) {
                        console.log('\x1b[31m%s\x1b[0m',"Error uploading file:", err);
                    } else {
                        console.log('\x1b[36m%s\x1b[0m',"File uploaded successfully. Location:", data.Location);
                    }
                });
            }
            
        }
    }


    console.log('\x1b[7m%s\x1b[0m', 'Files Minified successfully.');
    return "Success";
};

module.exports = Minify;
