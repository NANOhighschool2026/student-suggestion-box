# student-suggestion-box
학생회 건의함 웹사이트

## DB 설정

표, 권한 정책, 글자 수 제한, 욕설 검사는 `supabase/schema.sql` 에 있습니다.
Supabase 대시보드의 SQL Editor 에 통째로 붙여 실행합니다. 여러 번 실행해도 결과가 같습니다.

## 관리자 추가

로그인 계정을 만드는 것만으로는 건의사항을 볼 수 없습니다. 관리자 명단(`admins` 표)에도 넣어야 합니다.

1. Supabase 대시보드 Authentication > Users 에서 계정을 만듭니다.
2. SQL Editor 에서 아래를 실행합니다. 이메일은 방금 만든 계정으로 바꿉니다.

```sql
insert into public.admins (user_id)
select id from auth.users where email = '관리자 이메일';
```

관리자를 빼려면 Users 에서 계정을 지웁니다. 명단에서도 같이 빠집니다.

## 욕설 낱말 바꾸기

`script.js` 의 `blockedWords` 와 `supabase/schema.sql` 의 `check_suggestion_content` 에 같은 목록이 있습니다. 양쪽을 같이 바꾸고 `schema.sql` 을 다시 실행합니다.
