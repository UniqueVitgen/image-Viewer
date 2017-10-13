package org.techforumist.jwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.techforumist.jwt.domain.Tag;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag,Long> {
    Tag findByName(String name);
    @Query(value = "SELECT tags.* FROM tags,pricture_tags where tags.id = pricture_tags.tag_id group by id order by count(picture_id) desc",
            nativeQuery = true)
    List<Tag> orderByPopular();
}
