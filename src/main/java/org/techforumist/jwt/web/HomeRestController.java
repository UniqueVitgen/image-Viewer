package org.techforumist.jwt.web;

import com.mysql.jdbc.Blob;
import com.sun.javafx.scene.input.PickResultChooser;
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
import org.techforumist.jwt.domain.Tag;
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

	@PostMapping("/upload") // //new annotation since 4.3
	public ResponseEntity<Picture> singleFileUpload(@RequestParam("file") MultipartFile file,
								   @RequestParam("name") String name,
								   @RequestParam("description") String description,
								   @RequestParam("tags") String[] tags
								   ) {

		Picture picture = null;
		try {

			// Get the file and save it somewhere
			byte[] bytes = file.getBytes();
			picture = new Picture();
			picture.setSource(file.getBytes());
			picture.setName(name);
			picture.setDescription(description);
			Tag tag;
			for(String tagName : tags){
				if((tag = tagRepository.findByName(tagName)) == null){
					tag = new Tag();
					tag.setName(tagName);
					tagRepository.save(tag);
				}
				picture.getTags().add(tag);
			}
			return new ResponseEntity<Picture>(pictureRepository.save(picture), HttpStatus.CREATED);


		} catch (IOException e) {
			e.printStackTrace();
		}

		return new ResponseEntity<Picture>(picture, HttpStatus.BAD_REQUEST);
	}

	public List<Tag> getRandomElements(final int amount, final List<Tag> list) {
		ArrayList<Tag> returnList = new ArrayList<Tag>(list);

		Collections.shuffle(returnList); // тут делаем рандом
		if (returnList.size() > amount) { // отрезаем не нужную часть
			// тут отрезаем не нужную часть
			list.subList(returnList.size() - amount, returnList.size()).clear();

			return returnList;
		}
		return returnList;
	}

	@RequestMapping(value = "/popular", method = RequestMethod.GET)
	public List<Tag> getPopularTags(){
		List<Tag> tags = tagRepository.findAll();
		getRandomElements(tags.size()-7,tags);
		return tags;
	}

	@RequestMapping(value = "/tags", method = RequestMethod.GET)
	public List<Tag> getTags(){
		List<Tag> tags = tagRepository.findAll();
		return tags;
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

	@RequestMapping(value="/pictures",method = RequestMethod.GET)
	public List<Picture> pictures(){
		return pictureRepository.findAll();
	}
}
