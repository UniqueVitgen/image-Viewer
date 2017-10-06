package org.techforumist.jwt.web;

import com.mysql.jdbc.Blob;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.techforumist.jwt.domain.AppUser;
import org.techforumist.jwt.domain.Picture;
import org.techforumist.jwt.repository.AppUserRepository;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URL;
import java.security.Principal;
import java.util.*;

/**
 * All web services in this controller will be available for all the users
 * 
 * @author Sarath Muraleedharan
 *
 */
@RestController
public class HomeRestController {
	@Autowired
	private AppUserRepository appUserRepository;

	/**
	 * This method is used for user registration. Note: user registration is not
	 * require any authentication.
	 * 
	 * @param appUser
	 * @return
	 */
	@RequestMapping(value = "/register", method = RequestMethod.POST)
	public ResponseEntity<AppUser> createUser(@RequestBody AppUser appUser) {
		if (appUserRepository.findOneByUsername(appUser.getUsername()) != null) {
			throw new RuntimeException("Username already exist");
		}
		List<String> roles = new ArrayList<>();
		roles.add("USER");
		appUser.setRoles(roles);
		return new ResponseEntity<AppUser>(appUserRepository.save(appUser), HttpStatus.CREATED);
	}

	/**
	 * This method will return the logged user.
	 * 
	 * @param principal
	 * @return Principal java security principal object
	 */
	@RequestMapping("/user")
	public AppUser user(Principal principal) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String loggedUsername = auth.getName();
		return appUserRepository.findOneByUsername(loggedUsername);
	}

	/**
	 * @param email
	 * @param password
	 * @param response
	 * @return JSON contains token and user after success authentication.
	 * @throws IOException
	 */
	@RequestMapping(value = "/authenticate", method = RequestMethod.POST)
	public ResponseEntity<Map<String, Object>> login(@RequestParam String email, @RequestParam String password,
			HttpServletResponse response) throws IOException {
		String token = null;
		AppUser appUser = appUserRepository.findOneByEmail(email);
		Map<String, Object> tokenMap = new HashMap<String, Object>();
		if (appUser != null && appUser.getPassword().equals(password)) {
			token = Jwts.builder().setSubject(appUser.getUsername()).claim("roles", appUser.getRoles()).setIssuedAt(new Date())
					.signWith(SignatureAlgorithm.HS256, "secretkey").compact();
			tokenMap.put("token", token);
			tokenMap.put("user", appUser);
			return new ResponseEntity<Map<String, Object>>(tokenMap, HttpStatus.OK);
		} else {
			tokenMap.put("token", null);
			return new ResponseEntity<Map<String, Object>>(tokenMap, HttpStatus.UNAUTHORIZED);
		}

	}

	@RequestMapping(value = "/publish", method = RequestMethod.POST)
	public ResponseEntity<Picture> publish(@RequestParam String name, @RequestParam String description,
										   @RequestParam File source, @RequestParam String[] tags,
										   HttpServletResponse response) throws IOException {

		try{
			File f1 = source;
			File f2 = new File("E:\\Image");
			InputStream in = new FileInputStream(f1);

			//For Append the file.
			//OutputStream out = new FileOutputStream(f2,true);

			//For Overwrite the file.
			OutputStream out = new FileOutputStream(f2);

			byte[] buf = new byte[1024];
			int len;
			while ((len = in.read(buf)) > 0){
				out.write(buf, 0, len);
			}
			in.close();
			out.close();
			System.out.println("File copied.");
		}
		catch(FileNotFoundException ex){
			System.out.println(ex.getMessage() + " in the specified directory.");
			System.exit(0);
		}
		catch(IOException e){
			System.out.println(e.getMessage());
		}
//		Picture picture = new Picture();
//		picture.setName(name);
//		picture.setDescriptuion(description);
	    return null;
	}
}
