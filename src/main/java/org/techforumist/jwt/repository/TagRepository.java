package org.techforumist.jwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.techforumist.jwt.domain.Tag;

public interface TagRepository extends JpaRepository<Tag,Long> {
}
