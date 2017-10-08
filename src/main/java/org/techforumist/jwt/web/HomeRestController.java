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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.techforumist.jwt.domain.AppUser;
import org.techforumist.jwt.domain.Picture;
import org.techforumist.jwt.repository.AppUserRepository;
import org.techforumist.jwt.repository.PictureRepository;
import org.techforumist.jwt.repository.TagRepository;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
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

	@Autowired
	private PictureRepository pictureRepository;

	@Autowired
	private TagRepository tagRepository;

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

//	@RequestMapping(value = "/upload", method = RequestMethod.POST)
//	public @ResponseBody String saveUserDataAndFile(@RequestParam("file") MultipartFile file,
//													MultipartHttpServletRequest request) {
//		// Im Still wotking on it
//		return "";
//	}

	@PostMapping("/upload") // //new annotation since 4.3
	public String singleFileUpload(@RequestParam("file") MultipartFile file
								   ) {

		try {

			// Get the file and save it somewhere
			byte[] bytes = file.getBytes();

		} catch (IOException e) {
			e.printStackTrace();
		}

		return "uploadStatus";
	}

	@RequestMapping(value = "/publish", method = RequestMethod.POST)
	public ResponseEntity<Picture> publish(@RequestParam String name, @RequestParam String description,
										   @RequestParam byte[] source, @RequestParam String[] tags,
										   HttpServletResponse response) throws IOException {

//		URL url = new URL(source);
//		BufferedImage img = ImageIO.read(url);
//		File file = new File("downloaded.jpg");
//		ImageIO.write(img, "jpg", file);
		Picture picture = new Picture();
//		picture.setName(name);
//		picture.setDescription(description);
	    return new ResponseEntity<Picture>(pictureRepository.save(picture), HttpStatus.CREATED);
	}
}
