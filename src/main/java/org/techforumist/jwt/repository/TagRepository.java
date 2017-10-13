package org.techforumist.jwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.techforumist.jwt.domain.Tag;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag,Long> {
    Tag findByName(String name);
    @Query(value = "select * from testdb.tags where id in (SELECT tag_id FROM testdb.pricture_tags group by tag_id order by tag_id)",
    nativeQuery = true)
    List<Tag> orderByPopular();
}
