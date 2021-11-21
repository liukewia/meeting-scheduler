# SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS user_role;
DROP TABLE IF EXISTS priority;
DROP TABLE IF EXISTS priority;

CREATE TABLE user
(
    id         bigint unsigned NOT NULL AUTO_INCREMENT,
    username   varchar(64)  DEFAULT NULL,
    password   varchar(64)  DEFAULT NULL,
    avatar     varchar(255) DEFAULT NULL,
    email      varchar(64)  DEFAULT NULL,
    utc_offset bigint       DEFAULT NULL,
    status     int             NOT NULL,
    created    timestamp    DEFAULT NULL,
    last_login timestamp    DEFAULT NULL,
    PRIMARY KEY (id),
    KEY UK_USERNAME (username) USING BTREE
) engine = InnoDB
  auto_increment = 1
  default charset = utf8mb4
  collate = utf8mb4_0900_ai_ci;

# pwd 111111
INSERT INTO scheduler.user (id, username, `password`, avatar, email, utc_offset,
                            `status`, created, last_login)
VALUES ('1', 'finn', '96e79218965eb72c92a549dd5a330112',
        'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
        'liukewia@gmail.com', '0', '0', '2021-11-20 10:44:01', NULL);

# pwd 222222
INSERT INTO scheduler.user (id, username, `password`, avatar, email, utc_offset,
                            `status`, created, last_login)
VALUES ('2', 'david', 'e3ceb5881a0a1fdaad01296d7554868d',
        'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
        'david@live.com', '3600000', '0', '2021-11-20 10:48:02', NULL);


CREATE TABLE role
(
    id   bigint unsigned NOT NULL AUTO_INCREMENT,
    name varchar(64)     NOT NULL,
    PRIMARY KEY (id)
) engine = InnoDB
  auto_increment = 1
  default charset = utf8mb4
  collate = utf8mb4_0900_ai_ci;

INSERT INTO scheduler.role (id, `name`)
VALUES ('1', 'administrator');
INSERT INTO scheduler.role (id, `name`)
VALUES ('2', 'user');

# https://blog.csdn.net/u014320421/article/details/108071979
CREATE TABLE user_role
(
    user_id bigint unsigned NOT NULL,
    role_id bigint unsigned NOT NULL,
    PRIMARY KEY (user_id, role_id),
    foreign key (user_id) REFERENCES user (id) on delete cascade on update cascade,
    foreign key (role_id) REFERENCES role (id) on delete cascade on update cascade
) engine = InnoDB
  default charset = utf8mb4
  collate = utf8mb4_0900_ai_ci;

INSERT INTO scheduler.user_role (user_id, role_id)
VALUES ('1', '1');
INSERT INTO scheduler.user_role (user_id, role_id)
VALUES ('2', '2');



CREATE TABLE priority
(
    id   bigint      NOT NULL,
    name varchar(10) NOT NULL,

    PRIMARY KEY (id)
) engine = InnoDB
  default charset = utf8mb4
  collate = utf8mb4_0900_ai_ci;

INSERT INTO scheduler.priority (id, name)
VALUES ('0', 'none');
INSERT INTO scheduler.priority (id, name)
VALUES ('1', 'low');
INSERT INTO scheduler.priority (id, name)
VALUES ('2', 'normal');
INSERT INTO scheduler.priority (id, name)
VALUES ('3', 'high');
INSERT INTO scheduler.priority (id, name)
VALUES ('10', 'inf');


# schedule has priorities, no repeat function
CREATE TABLE schedule
(
    id          bigint unsigned NOT NULL AUTO_INCREMENT,
    user_id     bigint unsigned NOT NULL,
    title       varchar(64)  DEFAULT NULL,
    start_time  timestamp       NOT NULL,
    end_time    timestamp       NOT NULL,
    priority_id bigint          NOT NULL,
    location    varchar(64)  DEFAULT NULL,
    note        varchar(255) DEFAULT NULL,

    PRIMARY KEY (id),
    foreign key (user_id) REFERENCES user (id) on delete cascade on update cascade,
    foreign key (priority_id) REFERENCES priority (id) on delete cascade on update cascade
) engine = InnoDB
  auto_increment = 1
  default charset = utf8mb4
  collate = utf8mb4_0900_ai_ci;

INSERT INTO scheduler.schedule (id, user_id, title, start_time, end_time, priority_id, location,
                                note)
VALUES ('1', '1', 'Learn Python', '2021-11-18 08:00:00', '2021-11-18 09:00:00', '2', null, null);



# CREATE TABLE schedule_priority
# (
#     schedule_id bigint unsigned NOT NULL,
#     priority_id bigint          NOT NULL,
#     PRIMARY KEY (schedule_id, priority_id),
#     foreign key (schedule_id) REFERENCES schedule (id) on delete cascade on update cascade,
#     foreign key (priority_id) REFERENCES priority (id) on delete cascade on update cascade
# ) engine = InnoDB
#   default charset = utf8mb4
#   collate = utf8mb4_0900_ai_ci;
#
# INSERT INTO scheduler.user_role (user_id, role_id)
# VALUES ('1', '0');


# CREATE TABLE user_schedule
# (
#     user_id     bigint unsigned NOT NULL,
#     schedule_id bigint unsigned NOT NULL,
#     PRIMARY KEY (user_id, schedule_id),
#     foreign key (user_id) REFERENCES user (id) on delete cascade on update cascade,
#     foreign key (schedule_id) REFERENCES schedule (id) on delete cascade on update cascade
# ) engine = InnoDB
#   default charset = utf8mb4
#   collate = utf8mb4_0900_ai_ci;

