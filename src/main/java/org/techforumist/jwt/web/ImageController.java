
package org.techforumist.jwt.web;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.cloudinary.json.JSONArray;
import org.cloudinary.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value="/cloud")
public class ImageController
{
    @Autowired
    @Qualifier("com.cloudinary.cloud_name")
    String mCloudName;

    @Autowired
    @Qualifier("com.cloudinary.api_key")
    String mApiKey;

    @Autowired
    @Qualifier("com.cloudinary.api_secret")
    String mApiSecret;

    @GetMapping(value="/image")
    public ResponseEntity< List<String> > get(
        @RequestParam(value="name", required=false) String aName)
    {
        Cloudinary c=new Cloudinary("cloudinary://"+mApiKey+":"+mApiSecret+"@"+mCloudName);
        List<String> retval=new ArrayList<String>();
        try
        {
            Map response=c.api().resource("", ObjectUtils.asMap("type", "upload"));
            JSONObject json=new JSONObject(response);
            JSONArray ja=json.getJSONArray("resources");
            for(int i=0; i<ja.length(); i++)
            {
                JSONObject j=ja.getJSONObject(i);
                retval.add(j.getString("url"));
            }

            return new ResponseEntity< List<String> >(retval, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity< List<String> >(HttpStatus.BAD_REQUEST);
        }
    }

    public String post( MultipartFile aFile)
    {
        Cloudinary c=new Cloudinary("cloudinary://"+mApiKey+":"+mApiSecret+"@"+mCloudName);

        try
        {
            File f=Files.createTempFile("temp", aFile.getOriginalFilename()).toFile();
            aFile.transferTo(f);

            Map response=c.uploader().upload(f, ObjectUtils.emptyMap());
            JSONObject json=new JSONObject(response);
            String url=json.getString("url");
            return url;
        }
        catch(Exception e)
        {
        }
        return null;
    }
};
